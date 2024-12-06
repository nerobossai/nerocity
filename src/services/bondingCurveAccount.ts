import type { Layout } from "@coral-xyz/borsh";
import { bool, struct, u64 } from "@coral-xyz/borsh";

export class BondingCurveAccount {
  public discriminator: number;

  public virtualTokenReserves: number;

  public virtualSolReserves: number;

  public realTokenReserves: number;

  public realSolReserves: number;

  public tokenTotalSupply: number;

  public complete: boolean;

  public initialTokenReserve: number;

  constructor(
    discriminator: number,
    virtualTokenReserves: number,
    virtualSolReserves: number,
    realTokenReserves: number,
    realSolReserves: number,
    tokenTotalSupply: number,
    complete: boolean,
    initialTokenReserve: number = 793100000000000,
  ) {
    this.discriminator = discriminator;
    this.virtualTokenReserves = virtualTokenReserves;
    this.virtualSolReserves = virtualSolReserves;
    this.realTokenReserves = realTokenReserves;
    this.realSolReserves = realSolReserves;
    this.tokenTotalSupply = tokenTotalSupply;
    this.complete = complete;
    this.initialTokenReserve = initialTokenReserve;
  }

  getBuyPrice(amount: number): number {
    if (this.complete) {
      throw new Error("Curve is complete");
    }

    if (amount <= 0) {
      return 0;
    }

    return Math.floor(
      (amount * this.virtualTokenReserves) / this.virtualSolReserves,
    );
  }

  getSellPrice(amount: number, feeBasisPoints: number): number {
    if (this.complete) {
      throw new Error("Curve is complete");
    }

    if (amount <= 0) {
      return 0;
    }

    // Calculate the proportional amount of virtual sol reserves to be received
    const n =
      (amount * this.virtualSolReserves) / (this.virtualTokenReserves + amount);

    // Calculate the fee amount in the same units
    const a = (n * feeBasisPoints) / 10000;

    // Return the net amount after deducting the fee
    return n - a;
  }

  getMarketCapSOL(): number {
    if (this.virtualTokenReserves === 0) {
      return 0;
    }

    return (
      (this.tokenTotalSupply * this.virtualSolReserves) /
      this.virtualTokenReserves
    );
  }

  getFinalMarketCapSOL(feeBasisPoints: number): number {
    const totalSellValue = this.getBuyOutPrice(
      this.realTokenReserves,
      feeBasisPoints,
    );
    const totalVirtualValue = this.virtualSolReserves + totalSellValue;
    const totalVirtualTokens =
      this.virtualTokenReserves - this.realTokenReserves;

    if (totalVirtualTokens === 0) {
      return 0;
    }

    return (this.tokenTotalSupply * totalVirtualValue) / totalVirtualTokens;
  }

  getBuyOutPrice(amount: number, feeBasisPoints: number): number {
    const solTokens =
      amount < this.realSolReserves ? this.realSolReserves : amount;
    const totalSellValue =
      (solTokens * this.virtualSolReserves) /
        (this.virtualTokenReserves - solTokens) +
      1;
    const fee = (totalSellValue * feeBasisPoints) / 10000;
    return totalSellValue + fee;
  }

  public static default(): BondingCurveAccount {
    const virtualSolReserves = 30000000000;
    const virtualTokenReserves = 1073000000000000;
    const discriminator = 6966180631402821399;
    const totalTokenSupply = 1000000000000000;
    const realTokenReserves = 793100000000000;
    
    return new BondingCurveAccount(
      discriminator,
      virtualTokenReserves,
      virtualSolReserves,
      realTokenReserves,
      0,
      totalTokenSupply,
      false,
    );
  }

  public static fromBuffer(buffer: Buffer): BondingCurveAccount {
    const structure: Layout<BondingCurveAccount> = struct([
      u64("discriminator"),
      u64("virtualTokenReserves"),
      u64("virtualSolReserves"),
      u64("realTokenReserves"),
      u64("realSolReserves"),
      u64("tokenTotalSupply"),
      bool("complete"),
    ]);

    const value = structure.decode(buffer);
    return new BondingCurveAccount(
      value.discriminator,
      value.virtualTokenReserves,
      value.virtualSolReserves,
      value.realTokenReserves,
      value.realSolReserves,
      value.tokenTotalSupply,
      value.complete,
    );
  }
}
