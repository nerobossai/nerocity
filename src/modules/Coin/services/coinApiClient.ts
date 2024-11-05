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
}

export const coinApiClient = new ApiClient();
