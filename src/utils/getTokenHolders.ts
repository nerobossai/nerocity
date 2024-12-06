import axios from "axios";

let cache: any = {};
const cacheKey = "gettokenholders-cache";

export const getTokenHolders = async (token: string): Promise<string> => {
  try {
    if (Object.keys(cache).length === 0) {
      cache = JSON.parse(localStorage.getItem(cacheKey) || "{}");
    }

    const url = `https://api.neroboss.ai/agents/info/${token}`;

    // if last fetched timestamp is less than 1 minute then return cached result
    if (cache[token] && Date.now() - cache[token].timestamp <= 1000 * 60) {
      console.log("using cached holder data");
      return cache[token].result;
    }

    const resp = await axios.get(url);
    const { data } = resp;

    cache[token] = {
      result: data.holder || 0,
      timestamp: Date.now(),
    };

    localStorage.setItem(cacheKey, JSON.stringify(cache));

    return data.holder || 0;
  } catch (err) {
    return "0";
  }
};
