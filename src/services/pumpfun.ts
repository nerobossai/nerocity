// import type { Provider } from "@coral-xyz/anchor";
import type { Provider } from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import type { Commitment, Keypair } from "@solana/web3.js";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { BN } from "bn.js";

import { NEROBOSS_MINT, RPC_NODE_URL } from "@/constants/platform";
import { coinApiClient } from "@/modules/Coin/services/coinApiClient";
import { homeApiClient } from "@/modules/Home/services/homeApiClient";

import { ENDPOINT } from "./baseApiClient";
import { BondingCurveAccount } from "./bondingCurveAccount";
import {
  toCompleteEvent,
  toCreateEvent,
  toSetParamsEvent,
  toTradeEvent,
} from "./events";
import { GlobalAccount } from "./globalAccount";
import type { PumpFun } from "./IDL";
import { IDL } from "./IDL";
import type {
  CompleteEvent,
  CreateEvent,
  CreateTokenMetadata,
  PriorityFee,
  PumpFunEventHandlers,
  PumpFunEventType,
  SetParamsEvent,
  TokenMetadata,
  TradeEvent,
} from "./types";
import {
  calculateWithSlippageBuy,
  calculateWithSlippageSell,
  DEFAULT_COMMITMENT,
  sendTx,
} from "./utils";

const PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
const MPL_TOKEN_METADATA_PROGRAM_ID =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

export const GLOBAL_ACCOUNT_SEED = "global";
export const MINT_AUTHORITY_SEED = "mint-authority";
export const BONDING_CURVE_SEED = "bonding-curve";
export const METADATA_SEED = "metadata";

export const DEFAULT_DECIMALS = 6;

export const FEES = Object.freeze({
  platform: {
    type: "flat",
    amount: 0.0,
  },
  trade_fees: {
    type: "percent",
    amount: 0.85,
  },
});

export const NEROBOSS_BURN = 10000 * 1e6;

export class PumpFunSDK {
  public program: Program<PumpFun>;

  public connection: Connection;

  constructor(provider?: Provider) {
    this.program = new Program<PumpFun>(IDL as PumpFun, provider);
    this.connection = this.program.provider.connection;
  }

  async createAndBuy(
    creator: PublicKey,
    mint: Keypair,
    tokenMetadata: {
      metadata: TokenMetadata;
      metadataUri: string;
    },
    buyAmountSol: number,
    slippageBasisPoints: number = 500,
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT
  ): Promise<{
    createResults: VersionedTransaction;
    tokenMetadata: TokenMetadata;
  }> {
    const createTx = await this.getCreateInstructions(
      creator,
      tokenMetadata.metadata.name,
      tokenMetadata.metadata.symbol,
      tokenMetadata.metadataUri,
      mint
    );

    const newTx = new Transaction().add(createTx);

    if (buyAmountSol > 0) {
      const globalAccount = await this.getGlobalAccount(commitment);
      const buyAmount = globalAccount.getInitialBuyPrice(buyAmountSol);
      const buyAmountWithSlippage = calculateWithSlippageBuy(
        buyAmountSol,
        slippageBasisPoints
      );

      const buyTx = await this.getBuyInstructions(
        creator,
        mint.publicKey,
        globalAccount.feeRecipient,
        buyAmount,
        buyAmountWithSlippage
      );

      newTx.add(buyTx);
    }

    let platformFeesInSol;

    if (FEES.platform.type === "flat") {
      platformFeesInSol = FEES.platform.amount;
    } else {
      try {
        const solPrice = await homeApiClient.solPrice();
        platformFeesInSol =
          FEES.platform.amount *
          parseFloat((1 / solPrice.solana.usd).toFixed(3));
      } catch (err) {
        console.log(err);
        platformFeesInSol = 0.01;
      }
    }

    const tokenAddress = await getAssociatedTokenAddress(
      new PublicKey(NEROBOSS_MINT),
      creator
    );
    const createResults = await sendTx(
      this.connection,
      newTx,
      creator,
      [mint],
      platformFeesInSol,
      priorityFees,
      NEROBOSS_BURN,
      tokenAddress,
      commitment
    );
    return { createResults, tokenMetadata: tokenMetadata.metadata };
  }

  async createAndBuyXAgent(
    buyer: PublicKey,
    mint: PublicKey,
    buyAmountSol: number,
    slippageBasisPoints: number = 100,
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT
  ): Promise<VersionedTransaction> {
    const resp = await coinApiClient.createAndBuyInstructionSerialized({
      isFreeCoinCreation: true,
      mint: mint.toString(),
      payer: buyer.toString(),
      buyAmountSol,
    });
    const { serializedTx } = resp;
    const txn = VersionedTransaction.deserialize(bs58.decode(serializedTx));
    return txn;
  }

  async buy(
    buyer: PublicKey,
    mint: PublicKey,
    buyAmountSol: number,
    slippageBasisPoints: number = 100,
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT
  ): Promise<VersionedTransaction> {
    const buyTx = await this.getBuyInstructionsBySolAmount(
      buyer,
      mint,
      buyAmountSol,
      slippageBasisPoints,
      commitment
    );

    let platformFeesInSol;
    if (FEES.trade_fees.type === "flat") {
      platformFeesInSol = FEES.trade_fees.amount;
    } else {
      platformFeesInSol =
        parseFloat(
          parseFloat(
            ((FEES.trade_fees.amount / 100) * buyAmountSol).toString()
          ).toFixed(8)
        ) / LAMPORTS_PER_SOL;
    }

    const buyResults = await sendTx(
      this.connection,
      buyTx,
      buyer,
      [],
      platformFeesInSol,
      priorityFees,
      0,
      undefined,
      commitment
    );
    return buyResults;
  }

  async sell(
    seller: PublicKey,
    mint: PublicKey,
    sellTokenAmount: number,
    slippageBasisPoints: number = 100,
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT
  ): Promise<VersionedTransaction> {
    const sellTx = await this.getSellInstructionsByTokenAmount(
      seller,
      mint,
      sellTokenAmount,
      slippageBasisPoints,
      commitment
    );

    const platformFeesInSol = 0;

    const sellResults = await sendTx(
      this.connection,
      sellTx,
      seller,
      [],
      platformFeesInSol,
      priorityFees,
      0,
      undefined,
      commitment
    );
    return sellResults;
  }

  // create token instructions
  async getCreateInstructions(
    creator: PublicKey,
    name: string,
    symbol: string,
    uri: string,
    mint: Keypair
  ) {
    const mplTokenMetadata = new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);

    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(METADATA_SEED),
        mplTokenMetadata.toBuffer(),
        mint.publicKey.toBuffer(),
      ],
      mplTokenMetadata
    );

    const associatedBondingCurve = await getAssociatedTokenAddress(
      mint.publicKey,
      this.getBondingCurvePDA(mint.publicKey),
      true
    );

    return this.program.methods
      .create(name, symbol, uri)
      .accounts({
        mint: mint.publicKey,
        associatedBondingCurve,
        metadata: metadataPDA,
        user: creator,
      })
      .signers([mint])
      .transaction();
  }

  async getBuyInstructionsBySolAmount(
    buyer: PublicKey,
    mint: PublicKey,
    buyAmountSol: number,
    slippageBasisPoints: number = 100,
    commitment: Commitment = DEFAULT_COMMITMENT
  ) {
    const bondingCurveAccount = await this.getBondingCurveAccount(
      mint,
      commitment
    );
    if (!bondingCurveAccount) {
      throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
    }

    const buyAmount = bondingCurveAccount.getBuyPrice(buyAmountSol);
    const buyAmountWithSlippage = calculateWithSlippageBuy(
      buyAmountSol,
      slippageBasisPoints
    );

    const globalAccount = await this.getGlobalAccount(commitment);

    return this.getBuyInstructions(
      buyer,
      mint,
      globalAccount.feeRecipient,
      buyAmount,
      buyAmountWithSlippage
    );
  }

  // buy
  async getBuyInstructions(
    buyer: PublicKey,
    mint: PublicKey,
    feeRecipient: PublicKey,
    amount: number,
    solAmount: number,
    commitment: Commitment = DEFAULT_COMMITMENT
  ) {
    const associatedBondingCurve = await getAssociatedTokenAddress(
      mint,
      this.getBondingCurvePDA(mint),
      true
    );

    const associatedUser = await getAssociatedTokenAddress(mint, buyer, false);

    const transaction = new Transaction();

    try {
      await getAccount(this.connection, associatedUser, commitment);
    } catch (e) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          buyer,
          associatedUser,
          buyer,
          mint
        )
      );
    }

    transaction.add(
      await this.program.methods
        .buy(new BN(amount), new BN(solAmount))
        .accounts({
          feeRecipient,
          mint,
          associatedBondingCurve,
          associatedUser,
          user: buyer,
        })
        .transaction()
    );

    return transaction;
  }

  // sell
  async getSellInstructionsByTokenAmount(
    seller: PublicKey,
    mint: PublicKey,
    sellTokenAmount: number,
    slippageBasisPoints: number = 100,
    commitment: Commitment = DEFAULT_COMMITMENT
  ) {
    const bondingCurveAccount = await this.getBondingCurveAccount(
      mint,
      commitment
    );
    if (!bondingCurveAccount) {
      throw new Error(`Bonding curve account not found: ${mint.toBase58()}`);
    }

    const globalAccount = await this.getGlobalAccount(commitment);

    const minSolOutput = bondingCurveAccount.getSellPrice(
      sellTokenAmount,
      globalAccount.feeBasisPoints
    );

    const sellAmountWithSlippage = calculateWithSlippageSell(
      minSolOutput,
      slippageBasisPoints
    );

    return this.getSellInstructions(
      seller,
      mint,
      globalAccount.feeRecipient,
      sellTokenAmount,
      sellAmountWithSlippage
    );
  }

  async getSellInstructions(
    seller: PublicKey,
    mint: PublicKey,
    feeRecipient: PublicKey,
    amount: number,
    minSolOutput: number
  ) {
    const associatedBondingCurve = await getAssociatedTokenAddress(
      mint,
      this.getBondingCurvePDA(mint),
      true
    );

    const associatedUser = await getAssociatedTokenAddress(mint, seller, false);

    const transaction = new Transaction();

    transaction.add(
      await this.program.methods
        .sell(new BN(amount), new BN(minSolOutput))
        .accounts({
          feeRecipient,
          mint,
          associatedBondingCurve,
          associatedUser,
          user: seller,
        })
        .transaction()
    );

    return transaction;
  }

  async getBondingCurveAccount(
    mint: PublicKey,
    commitment: Commitment = DEFAULT_COMMITMENT
  ) {
    const tokenAccount = await this.connection.getAccountInfo(
      this.getBondingCurvePDA(mint),
      commitment
    );
    if (!tokenAccount) {
      return BondingCurveAccount.default();
    }
    return BondingCurveAccount.fromBuffer(tokenAccount!.data);
  }

  async getGlobalAccount(commitment: Commitment = DEFAULT_COMMITMENT) {
    const [globalAccountPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_ACCOUNT_SEED)],
      new PublicKey(PROGRAM_ID)
    );

    const tokenAccount = await this.connection.getAccountInfo(
      globalAccountPDA,
      commitment
    );

    return GlobalAccount.fromBuffer(tokenAccount!.data);
  }

  getBondingCurvePDA(mint: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(BONDING_CURVE_SEED), mint.toBuffer()],
      this.program.programId
    )[0];
  }

  async createTokenMetadata(create: CreateTokenMetadata) {
    const formData = new FormData();
    formData.append("file", create.file);
    formData.append("name", create.name);
    formData.append("symbol", create.symbol);
    formData.append("description", create.description);
    formData.append("twitter", create.twitter || "");
    formData.append("telegram", create.telegram || "");
    formData.append("website", create.website || "");
    formData.append("showName", "true");
    const request = await fetch(`${ENDPOINT}/public/upload-metadata`, {
      method: "POST",
      body: formData,
    });
    return request.json();
  }

  // EVENTS
  addEventListener<T extends PumpFunEventType>(
    eventType: T,
    callback: (
      event: PumpFunEventHandlers[T],
      slot: number,
      signature: string
    ) => void
  ) {
    return this.program.addEventListener(
      eventType,
      (event: any, slot: number, signature: string) => {
        let processedEvent;
        switch (eventType) {
          case "createEvent":
            processedEvent = toCreateEvent(event as CreateEvent);
            callback(
              processedEvent as PumpFunEventHandlers[T],
              slot,
              signature
            );
            break;
          case "tradeEvent":
            processedEvent = toTradeEvent(event as TradeEvent);
            callback(
              processedEvent as PumpFunEventHandlers[T],
              slot,
              signature
            );
            break;
          case "completeEvent":
            processedEvent = toCompleteEvent(event as CompleteEvent);
            callback(
              processedEvent as PumpFunEventHandlers[T],
              slot,
              signature
            );
            console.log("completeEvent", event, slot, signature);
            break;
          case "setParamsEvent":
            processedEvent = toSetParamsEvent(event as SetParamsEvent);
            callback(
              processedEvent as PumpFunEventHandlers[T],
              slot,
              signature
            );
            break;
          default:
            console.error("Unhandled event type:", eventType);
        }
      }
    );
  }

  removeEventListener(eventId: number) {
    this.program.removeEventListener(eventId);
  }
}

export const pumpFunSdk = new PumpFunSDK({
  connection: new Connection(RPC_NODE_URL),
});
