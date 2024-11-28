import type { Layout } from "@coral-xyz/borsh";
import { bool, publicKey, struct, u64 } from "@coral-xyz/borsh";
import type { PublicKey } from "@solana/web3.js";

export class GlobalAccount {
  public discriminator: number;

  public initialized: boolean = false;

  public authority: PublicKey;

  public feeRecipient: PublicKey;

  public initialVirtualTokenReserves: number;

  public initialVirtualSolReserves: number;

  public initialRealTokenReserves: number;

  public tokenTotalSupply: number;

  public feeBasisPoints: number;

  constructor(
    discriminator: number,
    initialized: boolean,
    authority: PublicKey,
    feeRecipient: PublicKey,
    initialVirtualTokenReserves: number,
    initialVirtualSolReserves: number,
    initialRealTokenReserves: number,
    tokenTotalSupply: number,
    feeBasisPoints: number,
  ) {
    this.discriminator = discriminator;
    this.initialized = initialized;
    this.authority = authority;
    this.feeRecipient = feeRecipient;
    this.initialVirtualTokenReserves = initialVirtualTokenReserves;
    this.initialVirtualSolReserves = initialVirtualSolReserves;
    this.initialRealTokenReserves = initialRealTokenReserves;
    this.tokenTotalSupply = tokenTotalSupply;
    this.feeBasisPoints = feeBasisPoints;
  }

  getInitialBuyPrice(amount: number): number {
    if (amount <= 0) {
      return 0;
    }

    return Math.floor(
      (amount * this.initialVirtualTokenReserves) / this.initialVirtualSolReserves,
    );
  }

  public static fromBuffer(buffer: Buffer): GlobalAccount {
    const structure: Layout<GlobalAccount> = struct([
      u64("discriminator"),
      bool("initialized"),
      publicKey("authority"),
      publicKey("feeRecipient"),
      u64("initialVirtualTokenReserves"),
      u64("initialVirtualSolReserves"),
      u64("initialRealTokenReserves"),
      u64("tokenTotalSupply"),
      u64("feeBasisPoints"),
    ]);

    const value = structure.decode(buffer);
    return new GlobalAccount(
      value.discriminator,
      value.initialized,
      value.authority,
      value.feeRecipient,
      value.initialVirtualTokenReserves,
      value.initialVirtualSolReserves,
      value.initialRealTokenReserves,
      value.tokenTotalSupply,
      value.feeBasisPoints,
    );
  }
}
