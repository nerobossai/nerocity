import type { AxiosInstance, AxiosProgressEvent } from "axios";
import axios from "axios";

import { userStore } from "@/stores/useUserStore";

const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:7801"
    : "https://api.martian.fun";

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
    switch (type) {
      case "GET": {
        let query = "";
        if (body) {
          query = new URLSearchParams(body).toString();
          return this.axiosClient.get(`${url}?${query}`);
        }
        return this.axiosClient.get(url);
      }
      case "POST": {
        return this.axiosClient.post(url, body);
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
