import { ed25519 } from "@noble/curves/ed25519";
import { createBurnInstruction } from "@solana/spl-token";
import type {
  Commitment,
  Connection,
  Finality,
  Keypair,
  VersionedTransactionResponse,
} from "@solana/web3.js";
import {
  ComputeBudgetProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import { FEE_ADDRESS, NEROBOSS_MINT } from "@/constants/platform";

import type { PriorityFee } from "./types";

export const DEFAULT_COMMITMENT: Commitment = "finalized";
export const DEFAULT_FINALITY: Finality = "finalized";

const signMessage = (message: Uint8Array, secretKey: Uint8Array) =>
  ed25519.sign(message, secretKey.slice(0, 32));

export const calculateWithSlippageBuy = (
  amount: number,
  basisPoints: number
) => {
  const a = amount / LAMPORTS_PER_SOL;
  const b = basisPoints / 100;
  return a * (1 + b) * LAMPORTS_PER_SOL;
};

export const calculateWithSlippageSell = (
  amount: number,
  basisPoints: number
) => {
  const a = amount / LAMPORTS_PER_SOL;
  const b = basisPoints / 100;
  return a * (1 - b) * LAMPORTS_PER_SOL;
};

export async function sendTx(
  connection: Connection,
  tx: Transaction,
  payer: PublicKey,
  partialSigners: Keypair[],
  platformFees: number,
  priorityFees?: PriorityFee,
  nerobossBurn?: number,
  tokenAddress?: PublicKey,
  commitment: Commitment = DEFAULT_COMMITMENT
): Promise<VersionedTransaction> {
  const newTx = new Transaction();

  if (priorityFees) {
    const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
      units: priorityFees.unitLimit,
    });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: priorityFees.unitPrice,
    });
    newTx.add(modifyComputeUnits);
    newTx.add(addPriorityFee);
  }

  newTx.add(tx);

  if (platformFees) {
    const sendFeesInstruction = SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: new PublicKey(FEE_ADDRESS),
      lamports: platformFees * LAMPORTS_PER_SOL,
    });
    newTx.add(sendFeesInstruction);
  }

  if (nerobossBurn) {
    const burnInstruction = createBurnInstruction(
      tokenAddress!,
      new PublicKey(NEROBOSS_MINT),
      payer,
      nerobossBurn
    );

    newTx.add(burnInstruction);
  }

  const versionedTx = await buildVersionedTx(
    connection,
    payer,
    newTx,
    commitment
  );

  partialSigners.forEach((signer) => {
    const signature = signMessage(
      versionedTx.message.serialize(),
      signer?.secretKey!
    );
    versionedTx.addSignature(signer?.publicKey!, signature);
  });
  return versionedTx;
}

export const buildVersionedTx = async (
  connection: Connection,
  payer: PublicKey,
  tx: Transaction,
  commitment: Commitment = DEFAULT_COMMITMENT
): Promise<VersionedTransaction> => {
  const blockHash = (await connection.getLatestBlockhash(commitment)).blockhash;

  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockHash,
    instructions: tx.instructions,
  }).compileToV0Message();

  return new VersionedTransaction(messageV0);
};

export const getTxDetails = async (
  connection: Connection,
  sig: string,
  commitment: Commitment = DEFAULT_COMMITMENT,
  finality: Finality = DEFAULT_FINALITY
): Promise<VersionedTransactionResponse | null> => {
  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction(
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: sig,
    },
    commitment
  );

  return connection.getTransaction(sig, {
    maxSupportedTransactionVersion: 0,
    commitment: finality,
  });
};
