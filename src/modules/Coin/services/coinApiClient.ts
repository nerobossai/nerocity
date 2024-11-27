import { ApiEndpoints } from "@/constants/endpoints";
import type { AgentResponse } from "@/modules/Home/services/homeApiClient";
import { BaseApiClient } from "@/services/baseApiClient";
import { getErrorMessageFromAxios } from "@/utils/getErrorMessage";

export type ErrorResponse = {
  status: string;
  message: string;
};

export type SuccessResponse = {
  status: string;
  message: string;
};

export interface ActivityDetails {
  signature: string;
  mint: string;
  sol_amount: number;
  token_amount: number;
  is_buy: boolean;
  user: string;
  timestamp: number;
  tx_index: number;
  username: string | null;
  profile_image: string | null;
  slot: number;
}

export type ActivityResponse = {
  trades: ActivityDetails[];
};

export type SendMessageData = {
  agent_id: string;
  message: string;
  is_reply: boolean;
  message_id: string | undefined;
};

export type ChatsResponse = {
  status: string;
  chats: [
    {
      created_by: string;
      user_details: {
        profile_pic: string;
        public_key: string;
      };
      message_id: string;
      timestamp: string;
      image: string;
      message: string;
      is_reply: boolean;
      is_agent: boolean;
      replies: [
        {
          created_by: string;
          user_details: {
            profile_pic: string;
            public_key: string;
          };
          message_id: string;
          timestamp: string;
          image: string;
          message: string;
          is_reply: boolean;
          is_agent: boolean;
        },
      ];
    },
  ];
};

export type PumpfunCoinResponse = {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  video_uri: string | null;
  metadata_uri: string;
  twitter: string | null;
  telegram: string | null;
  bonding_curve: string;
  associated_bonding_curve: string;
  creator: string;
  created_timestamp: number;
  raydium_pool: string;
  complete: boolean;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;
  total_supply: number;
  website: string | null;
  show_name: boolean;
  king_of_the_hill_timestamp: number | null;
  market_cap: number;
  reply_count: number | null;
  last_reply: number | null;
  nsfw: boolean;
  market_id: string;
  inverted: boolean;
  is_currently_live: boolean;
  username: string;
  profile_image: string | null;
  usd_market_cap: number;
};

export type PoolPriceResponse = {
  id: string;
  type: string;
  attributes: {
    name: string;
    address: string;
    base_token_price_usd: string;
    quote_token_price_usd: string;
    base_token_price_native_currency: string;
    quote_token_price_native_currency: string;
    base_token_price_quote_token: string;
    quote_token_price_base_token: string;
    pool_created_at: string;
    reserve_in_usd: string;
    fdv_usd: string;
    market_cap_usd: string;
    price_change_percentage: {};
    transactions: {};
    volume_usd: {};
  };
  relationships: {};
};

class ApiClient extends BaseApiClient {
  constructor() {
    super({});
  }

  async getAgent(agentId: string): Promise<AgentResponse> {
    try {
      const resp = await this.apiCall({
        type: "GET",
        url: ApiEndpoints.agents.agent.replace(":agent_id", agentId),
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async sendMessage(data: SendMessageData): Promise<SuccessResponse> {
    try {
      const resp = await this.secureApiCall({
        type: "POST",
        url: ApiEndpoints.chat.send,
        body: data,
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async fetchChats(agentId: string): Promise<ChatsResponse> {
    try {
      const resp = await this.secureApiCall({
        type: "GET",
        url: ApiEndpoints.chat.fetch.replace(":agent_id", agentId),
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async fetchPumpfunData(agentId: string): Promise<PumpfunCoinResponse> {
    try {
      const resp = await this.apiCall({
        type: "GET",
        url: ApiEndpoints.agents.pumpfun.replace(":agent_id", agentId),
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async fetchPoolPrice(poolid: string): Promise<PoolPriceResponse> {
    try {
      const resp = await this.apiCall({
        type: "GET",
        url: `https://api.geckoterminal.com/api/v2/networks/solana/pools/${poolid}`,
      });
      return resp.data.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async fetchActivities(data: any): Promise<SuccessResponse> {
    try {
      const resp = await this.secureApiCall({
        type: "POST",
        url: ApiEndpoints.chat.activity,
        body: data,
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }
}

export const coinApiClient = new ApiClient();
