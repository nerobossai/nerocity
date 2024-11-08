import axios from "axios";

import { RPC_NODE_URL } from "@/constants/platform";

export const getTokenHolders = async (token: string): Promise<string> => {
  try {
    const resp = await axios.post(`${RPC_NODE_URL}`, {
      jsonrpc: "2.0",
      method: "getTokenAccounts",
      id: "helius-test",
      params: {
        limit: 1000,
        displayOptions: {},
        mint: token,
      },
    });

    const { data } = resp;

    return data.result.total === 1000 ? "1000+" : data.result.total.toString();
  } catch (err) {
    return "0";
  }
};
