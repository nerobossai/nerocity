import { ApiEndpoints } from "@/constants/endpoints";
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

export type SendMessageData = {
  agent_id: string;
  message: string;
  is_reply: boolean;
  message_id: string | undefined;
};

interface User {
  new_user: boolean;
  public_key: string;
  username: string;
  profile_pic: string;
}

interface ProfileResponse {
  status: string;
  user: User;
}

interface CoinResponse {
  agents: {
    user_details: {
      new_user: boolean;
    };
    id: string;
    name: string;
    market_cap: string;
    created_at: string;
    replies: string;
    ticker: string;
    description: string;
    image: string;
    token_metadata: {
      name: string;
      symbol: string;
      description: string;
      image: string;
      show_name: boolean;
      created_on: string;
    };
    mint_public_key: string;
    fee_basis_points: number;
    initial_virtual_sol_reserves: number;
    initial_virtual_token_reserves: number;
    current_virtual_sol_reserves: number;
    target_pool_balance: number;
    current_virtual_token_reserves: number;
  }[];
}

interface AgentCoinResponseData {
  status: string;
  created_by: string;
  user_details: {
    new_user: boolean;
    public_key: string;
    username: string;
    profile_pic: string;
  };
  id: string;
  name: string;
  market_cap: string;
  created_at: string;
  replies: string;
  ticker: string;
  description: string;
  token_metadata: {
    name: string;
    symbol: string;
    description: string;
    image: string;
    show_name: boolean;
    created_on: string;
  };
  mint_public_key: string;
  image: string;
  fee_basis_points: number;
  initial_virtual_sol_reserves: number;
  initial_virtual_token_reserves: number;
  current_virtual_sol_reserves: number;
  target_pool_balance: number;
  current_virtual_token_reserves: number;
}

class ApiClient extends BaseApiClient {
  constructor() {
    super({});
  }

  async fetchProfileByUserName(username: string): Promise<ProfileResponse> {
    try {
      const resp = await this.secureApiCall({
        type: "GET",
        url: ApiEndpoints.profile.fetchByUserName.replace(
          ":username",
          username
        ),
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async fetchProfileByPublicKey(publicKey: string): Promise<ProfileResponse> {
    try {
      const resp = await this.secureApiCall({
        type: "GET",
        url: ApiEndpoints.profile.fetchByPublicKey.replace(
          ":public_key",
          publicKey
        ),
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async fetchCoinsByPublicKey(publicKey: string): Promise<CoinResponse> {
    try {
      const resp = await this.secureApiCall({
        type: "GET",
        url: ApiEndpoints.profile.fetchCoinsByPublicKey.replace(
          ":public_key",
          publicKey
        ),
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async fetchCoinsCreatedByAgent(
    agentId: string
  ): Promise<AgentCoinResponseData> {
    try {
      const resp = await this.secureApiCall({
        type: "GET",
        url: ApiEndpoints.agents.fetchCoinsHeldByAgentId.replace(
          ":agent_id",
          agentId
        ),
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async getLinkTwitterUrl(agentId: string): Promise<any> {
    try {
      const resp = await this.secureApiCall({
        type: "POST",
        url: ApiEndpoints.agents.reconnectTwitter,
        body: {
          mintPublicKey: agentId,
        },
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }
}

export const profileApiClient = new ApiClient();
