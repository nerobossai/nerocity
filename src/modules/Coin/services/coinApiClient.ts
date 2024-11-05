import { ApiEndpoints } from "@/constants/endpoints";
import type { AgentResponse } from "@/modules/Home/services/homeApiClient";
import { BaseApiClient } from "@/services/baseApiClient";
import { getErrorMessageFromAxios } from "@/utils/getErrorMessage";

export type ErrorResponse = {
  status: string;
  message: string;
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
}

export const coinApiClient = new ApiClient();
