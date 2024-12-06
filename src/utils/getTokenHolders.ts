import axios from "axios";

let cache: any = {};
const cacheKey = "gettokenholders-cache";

export const getTokenHolders = async (token: string): Promise<string> => {
  try {
    if (Object.keys(cache).length === 0) {
      cache = JSON.parse(localStorage.getItem(cacheKey) || "{}");
    }

    const resp = await axios.get("https://api.neroboss.ai/agents/info/5ZkN152EbAEyaRjaBj4aT1jB8s5S6NJ3SiWt5EVwYz5y");

    // if last fetched timestamp is less than 1 minute then return cached result
    if (cache[token] && Date.now() - cache[token].timestamp <= 1000 * 60) {
      console.log("using cached holder data");
      return cache[token].result;
    }

    if (cache[token] && cache[token].result === "1000+") {
      console.log("using cached holder data");
      return cache[token].result;
    }

    const { data } = resp;
    const count =
      data.result.total === 1000 ? "1000+" : data.result.total.toString();

    cache[token] = {
      result: count,
      timestamp: Date.now(),
    };

    localStorage.setItem(cacheKey, JSON.stringify(cache));

    return count;
  } catch (err) {
    return "0";
  }
};
