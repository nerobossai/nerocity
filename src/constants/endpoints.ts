export const ApiEndpoints = Object.freeze({
  public: {
    feed: "/public/feed",
    overlord: "/public/overlord",
    candlestick: "/public/candlestick/:mint",
  },
  auth: {
    login: "/auth/login",
    validateToken: "/auth/validate-token",
    validateReferral: "/auth/validate-referral",
  },
  agents: {
    launch: "/agents/launch",
    agent: "/agents/:agent_id",
    twitteroauth1: "/agents/twitter-oauth1",
    validateoauth1: "/agents/twitter/validate-oauth1",
  },
  coins: {
    transactions: "/coins/transactions",
  },
  chat: {
    send: "/chat/send",
    fetch: "/chat/fetch/:agent_id",
  },
});
