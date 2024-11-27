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
  complete?: boolean;
  token_metadata: {
    name: string;
    symbol: string;
    description: string;
    image: string;
    showName: true;
    createdOn: string;
  };
  social?: {
    twitter: string;
    telegram: string;
  };
  mint_public_key: string;
};

export type FeedSuccessResponse = {
  status: string;
  last_index: string;
  agents: [
    {
      complete?: boolean | undefined;
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
      token_metadata: {
        name: string;
        symbol: string;
        description: string;
        image: string;
        showName: true;
        createdOn: string;
      };
      mint_public_key: string;
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

export type CandlestickResponse = {
  mint: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  slot: number;
  is_5_min: boolean;
  is_1_min: boolean;
}[];

class ApiClient extends BaseApiClient {
  cache: any = {};

  constructor() {
    super({});
  }

  async feed(filter: string): Promise<FeedSuccessResponse> {
    try {
      let endpoint = "";
      if (filter === "") {
        endpoint = ApiEndpoints.public.feed;
      } else {
        endpoint = `leaderboard/api/v1/${filter}`;
      }

      const resp = await this.apiCall({
        type: "GET",
        url: endpoint,
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async verifyNft(body: any): Promise<any> {
    try {
      const resp = await this.apiCall({
        type: "POST",
        url:  ApiEndpoints.public.checkNft,
        body
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async searchFeed(searchText: string): Promise<FeedSuccessResponse> {
    try {
      const endpoint = `/leaderboard/api/v1/search?query=${searchText}`;

      const resp = await this.apiCall({
        type: "GET",
        url: endpoint,
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
      this.cache.solprice = resp.data;
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async candlestickData(mint: string): Promise<CandlestickResponse> {
    try {
      const resp = await this.apiCall({
        type: "GET",
        url: ApiEndpoints.public.candlestick.replace(":mint", mint),
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }
}

export const homeApiClient = new ApiClient();
