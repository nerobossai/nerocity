import { ApiEndpoints } from "@/constants/endpoints";
import { BaseApiClient } from "@/services/baseApiClient";
import { getErrorMessageFromAxios } from "@/utils/getErrorMessage";

export type AgentResponse = {
  created_by: string;
  id: string;
  name: string;
  ticker: string;
  description: string;
  market_cap: string;
  created_at: number;
  replies: string;
  image: string;
  fee_basis_points: number;
  initial_real_token_reserves: number;
  initial_virtual_sol_reserves: number;
  initial_virtual_token_reserves: number;
  token_total_supply: number;
  current_real_token_reserves: number;
  current_virtual_sol_reserves: number;
  current_virtual_token_reserves: number;
  current_token_total_supply: number;
};

export type FeedSuccessResponse = {
  status: string;
  last_index: string;
  agents: [
    {
      created_by: string;
      id: string;
      name: string;
      ticker: string;
      description: string;
      market_cap: string;
      created_at: number;
      replies: string;
      image: string;
      fee_basis_points: number;
      initial_real_token_reserves: number;
      initial_virtual_sol_reserves: number;
      initial_virtual_token_reserves: number;
      token_total_supply: number;
      current_real_token_reserves: number;
      current_virtual_sol_reserves: number;
      current_virtual_token_reserves: number;
      current_token_total_supply: number;
    },
  ];
};

export type ErrorResponse = {
  status: string;
  message: string;
};

export type SolanaPriceResponse = {
  solana: {
    usd: number;
    usd_market_cap: number;
    usd_24h_vol: number;
    usd_24h_change: number;
    last_updated_at: number;
  };
};

class ApiClient extends BaseApiClient {
  cache: any = {};

  constructor() {
    super({});
  }

  async feed(): Promise<FeedSuccessResponse> {
    try {
      const resp = await this.apiCall({
        type: "GET",
        url: ApiEndpoints.public.feed,
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async overlord(): Promise<AgentResponse> {
    try {
      const resp = await this.apiCall({
        type: "GET",
        url: ApiEndpoints.public.overlord,
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async solPrice(): Promise<SolanaPriceResponse> {
    try {
      if ("solprice" in this.cache) {
        return this.cache.solprice;
      }
      const resp = await this.apiCall({
        type: "GET",
        url: "https://api.martianwallet.xyz/v1/prices?ids=solana",
      });
      this.cache.solprice = resp;
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }
}

export const homeApiClient = new ApiClient();
