import { Connection, PublicKey } from "@solana/web3.js";

import { RPC_NODE_URL } from "@/constants/platform";

interface TokenAccount {
  mint: string;
  balance: number;
}

const PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";

export async function getUserTokens(
  walletAddress: string,
): Promise<TokenAccount[]> {
  const connection = new Connection(RPC_NODE_URL);
  const publicKey = new PublicKey(walletAddress);

  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        programId: new PublicKey(PROGRAM_ID),
      },
    );

    return tokenAccounts.value.map((account) => {
      const { mint } = account.account.data.parsed.info;
      const balance = account.account.data.parsed.info.tokenAmount.uiAmount;
      return { mint, balance };
    });
  } catch (error) {
    console.error("Error fetching token accounts:", error);
    return [];
  }
}
