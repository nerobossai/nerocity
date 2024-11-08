import type { BondingCurveAccount } from "./bondingCurveAccount";
import type { GlobalAccount } from "./globalAccount";

export type BuyResult = {
  token_amount: number;
  sol_amount: number;
};

export type SellResult = {
  token_amount: number;
  sol_amount: number;
};

export class AMM {
  constructor(
    public virtualSolReserves: number,
    public virtualTokenReserves: number,
    public realSolReserves: number,
    public realTokenReserves: number,
    public initialVirtualTokenReserves: number,
  ) {}

  static fromGlobalAccount(global: GlobalAccount): AMM {
    return new AMM(
      global.initialVirtualSolReserves,
      global.initialVirtualTokenReserves,
      0,
      global.initialRealTokenReserves,
      global.initialVirtualTokenReserves,
    );
  }

  static fromBondingCurveAccount(
    bonding_curve: BondingCurveAccount,
    initialVirtualTokenReserves: number,
  ): AMM {
    return new AMM(
      bonding_curve.virtualSolReserves,
      bonding_curve.virtualTokenReserves,
      bonding_curve.realSolReserves,
      bonding_curve.realTokenReserves,
      initialVirtualTokenReserves,
    );
  }

  getBuyPrice(tokens: number): number {
    const product_of_reserves =
      this.virtualSolReserves * this.virtualTokenReserves;
    const new_virtual_token_reserves = this.virtualTokenReserves - tokens;
    const new_virtual_sol_reserves =
      product_of_reserves / new_virtual_token_reserves + 1;
    const amount_needed =
      new_virtual_sol_reserves > this.virtualSolReserves
        ? new_virtual_sol_reserves - this.virtualSolReserves
        : 0;
    return amount_needed > 0 ? amount_needed : 0;
  }

  applyBuy(token_amount: number): BuyResult {
    const final_token_amount =
      token_amount > this.realTokenReserves
        ? this.realTokenReserves
        : token_amount;
    const sol_amount = this.getBuyPrice(final_token_amount);

    this.virtualTokenReserves -= final_token_amount;
    this.realTokenReserves -= final_token_amount;

    this.virtualSolReserves += sol_amount;
    this.realSolReserves += sol_amount;

    return {
      token_amount: final_token_amount,
      sol_amount,
    };
  }

  applySell(token_amount: number): SellResult {
    this.virtualTokenReserves += token_amount;
    this.realTokenReserves += token_amount;

    const sell_price = this.getSellPrice(token_amount);

    this.virtualSolReserves -= sell_price;
    this.realSolReserves -= sell_price;

    return {
      token_amount,
      sol_amount: sell_price,
    };
  }

  getSellPrice(tokens: number): number {
    const scaling_factor = this.initialVirtualTokenReserves;
    const token_sell_proportion =
      (tokens * scaling_factor) / this.virtualTokenReserves;
    const sol_received =
      (this.virtualSolReserves * token_sell_proportion) / scaling_factor;
    return sol_received < this.realSolReserves
      ? sol_received
      : this.realSolReserves;
  }
}
