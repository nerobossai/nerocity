import { ApiEndpoints } from "@/constants/endpoints";
import { BaseApiClient } from "@/services/baseApiClient";
import { getErrorMessageFromAxios } from "@/utils/getErrorMessage";

export type LoginBody = {
  signature: string;
  message: string;
  public_key: string;
};

export type ValidateTokenBody = {
  token: string;
};

export type ValidateReferralBody = {
  code: string;
};

export type AuthSuccessResponse = {
  status: string;
  token: string;
  user: {
    username: string;
    public_key: string;
    profile_pic: string;
  };
};

export type AuthErrorResponse = {
  status: string;
  message: string;
};

class ApiClient extends BaseApiClient {
  constructor() {
    super({});
  }

  async login(body: LoginBody): Promise<AuthSuccessResponse> {
    try {
      const resp = await this.apiCall({
        type: "POST",
        url: ApiEndpoints.auth.login,
        body,
      });
      return resp.data;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async validateToken(body: ValidateTokenBody) {
    try {
      const resp = await this.apiCall({
        type: "POST",
        url: ApiEndpoints.auth.validateToken,
        body: {
          token: body.token,
        },
      });
      return resp.data.valid;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }

  async validateReferral(body: ValidateReferralBody) {
    try {
      const resp = await this.apiCall({
        type: "POST",
        url: ApiEndpoints.auth.validateReferral,
        body: {
          code: body.code,
        },
      });
      return resp.data.valid;
    } catch (err: any) {
      return Promise.reject(getErrorMessageFromAxios(err));
    }
  }
}

export const authApiClient = new ApiClient();
