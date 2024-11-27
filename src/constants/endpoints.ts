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
    pumpfun: "/agents/pumpfun/:agent_id",
    twitteroauth1: "/agents/twitter-oauth1",
    validateoauth1: "/agents/twitter/validate-oauth1",
    fetchCoinsHeldByAgentId: "/agents/:agent_id",
  },
  coins: {
    transactions: "/coins/transactions",
  },
  chat: {
    send: "/chat/send",
    fetch: "/chat/fetch/:agent_id",
    activity: "/leaderboard/api/v1/activity"
  },
  profile: {
    fetchByPublicKey: "/profile/get/:public_key",
    fetchByUserName: "/profile/get/username/:username",
    fetchCoinsByPublicKey: "/profile/coins/createdby/:public_key",
  },
});
