import { ApiEndpoints } from "@/constants/endpoints";
import { BaseApiClient } from "@/services/baseApiClient";
import type { TokenMetadata } from "@/services/types";
import { getErrorMessageFromAxios } from "@/utils/getErrorMessage";

export type LaunchAgentBody = {
  name: string;
  ticker: string;
  description: string;
  image: string;
  mintPublicKey: string;
  tokenMetadata: TokenMetadata;
  telegram?: string;
  twtToken?: string;
  txnHash: string;
};

export type LaunchSuccessResponse = {
  status: string;
  created_by: string;
  id: string;
  name: string;
  ticker: string;
  description: string;
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

export type ErrorResponse = {
  status: string;
  message: string;
};

export type TwitterOauthBody = {
  name: string;
  ticker: string;
  description: string;
  image: string;
  tokenMetadata: { metadata: TokenMetadata; metadataUri: string };
  telegram?: string;
};

export type TwitterOauthResponse = {
  authUrl: string;
};

export type TwitterValidateOauthBody = {
  oauthToken: string;
  oauthVerifier: string;
};

export type TwitterValidateOauthResponse = TwitterOauthBody & {
  twtToken: string;
};

class ApiClient extends BaseApiClient {
  constructor() {
    super({});
  }

  async launch(body: LaunchAgentBody): Promise<LaunchSuccessResponse> {
    try {
      const resp = await this.secureApiCall({
        type: "POST",
        url: ApiEndpoints.agents.launch,
        body,
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async getTwitterOauthLink(
    body: TwitterOauthBody,
  ): Promise<TwitterOauthResponse> {
    try {
      const resp = await this.secureApiCall({
        type: "POST",
        url: ApiEndpoints.agents.twitteroauth1,
        body,
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async validateOauth(
    body: TwitterValidateOauthBody,
  ): Promise<TwitterValidateOauthResponse> {
    try {
      const resp = await this.secureApiCall({
        type: "POST",
        url: ApiEndpoints.agents.validateoauth1,
        body,
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }
}

export const agentApiClient = new ApiClient();
