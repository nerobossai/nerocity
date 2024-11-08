import { ed25519 } from "@noble/curves/ed25519";
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

import { FEE_ADDRESS } from "@/constants/platform";

import type { PriorityFee } from "./types";

export const DEFAULT_COMMITMENT: Commitment = "finalized";
export const DEFAULT_FINALITY: Finality = "finalized";

const signMessage = (message: Uint8Array, secretKey: Uint8Array) =>
  ed25519.sign(message, secretKey.slice(0, 32));

export const calculateWithSlippageBuy = (
  amount: number,
  basisPoints: number,
) => {
  return amount + (amount * basisPoints) / 10000;
};

export const calculateWithSlippageSell = (
  amount: number,
  basisPoints: number,
) => {
  return amount - (amount * basisPoints) / 10000;
};

export async function sendTx(
  connection: Connection,
  tx: Transaction,
  payer: PublicKey,
  signers: Keypair[],
  partialSigners: Keypair[],
  platformFees: number,
  priorityFees?: PriorityFee,
  commitment: Commitment = DEFAULT_COMMITMENT,
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

  const versionedTx = await buildVersionedTx(
    connection,
    payer,
    newTx,
    commitment,
  );

  partialSigners.forEach((signer) => {
    const signature = signMessage(
      versionedTx.message.serialize(),
      signer?.secretKey!,
    );
    versionedTx.addSignature(signer?.publicKey!, signature);
  });
  versionedTx.sign(signers);
  return versionedTx;
}

export const buildVersionedTx = async (
  connection: Connection,
  payer: PublicKey,
  tx: Transaction,
  commitment: Commitment = DEFAULT_COMMITMENT,
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
  finality: Finality = DEFAULT_FINALITY,
): Promise<VersionedTransactionResponse | null> => {
  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction(
    {
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: sig,
    },
    commitment,
  );

  return connection.getTransaction(sig, {
    maxSupportedTransactionVersion: 0,
    commitment: finality,
  });
};
