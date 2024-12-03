import type { AxiosInstance, AxiosProgressEvent } from "axios";
import axios from "axios";

import { userStore } from "@/stores/useUserStore";

export const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "https://api.neroboss.ai"
    : "https://api.neroboss.ai";

interface BaseApiClientProps {
  baseURL?: string;
}

interface SecureApiCallParams {
  url: string;
  type: "GET" | "POST" | "DELETE";
  body?: any;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
  config?: any;
  token?: string;
}

interface ApiCallParams {
  url: string;
  type: "GET" | "POST";
  body?: any;
}

export class BaseApiClient {
  protected axiosClient: AxiosInstance;

  public baseUrl = ENDPOINT;

  constructor(props: BaseApiClientProps) {
    const { baseURL = ENDPOINT } = props;
    this.baseUrl = baseURL;

    this.axiosClient = axios.create({
      baseURL,
    });
  }

  async apiCall(params: ApiCallParams) {
    const { url, type, body } = params;
    const isPumpfun = url.startsWith("/agents/pumpfun");
    switch (type) {
      case "GET": {
        let query = "";
        if (body) {
          query = new URLSearchParams(body).toString();
          return this.axiosClient.get(`${url}?${query}`);
        }
        if (!isPumpfun) {
          return this.axiosClient.get(url);
        } else{
          const minAddress = url.split('/');
          return this.axiosClient.get(`https://hkpi1ruc98.execute-api.ap-south-1.amazonaws.com/coins/${minAddress[minAddress.length-1]}`);
        }
        
      }
      case "POST": {
        if (!isPumpfun) {
          return this.axiosClient.post(url, body);
        } else{
          const minAddress = url.split('/');
          return this.axiosClient.post(`https://hkpi1ruc98.execute-api.ap-south-1.amazonaws.com/coins/${minAddress[minAddress.length-1]}`, body);
        }
      }
      default:
        throw new Error("invalid request type");
    }
  }

  async secureApiCall(params: SecureApiCallParams) {
    const {
      url,
      type,
      body,
      token,
      onUploadProgress,
      onDownloadProgress,
      config = {},
    } = params;
    let jwt;

    if (!token) {
      const { token: storedToken } = userStore.getState();
      jwt = storedToken;
    } else {
      jwt = token;
    }

    let resp: any;
    switch (type) {
      case "GET": {
        let query = "";
        if (body) {
          query = new URLSearchParams(body).toString();
          return this.axiosClient.get(`${url}?${query}`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            onUploadProgress,
            onDownloadProgress,
            ...config,
          });
        }
        return this.axiosClient.get(url, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          onUploadProgress,
          onDownloadProgress,
          ...config,
        });
      }

      case "POST": {
        return this.axiosClient.post(url, body, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          onUploadProgress,
          onDownloadProgress,
          ...config,
        });
      }

      case "DELETE": {
        return this.axiosClient.delete(url, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          onUploadProgress,
          onDownloadProgress,
          ...config,
        });
      }

      default:
        throw new Error("invalid request type");
    }
  }
}
