export const ApiEndpoints = Object.freeze({
  public: {
    feed: "/public/feed",
    overlord: "/public/overlord",
    candlestick: "/public/candlestick/:mint",
    checkNft: "/leaderboard/api/v1/checkNft",
    platformStats: "/public/platform-stats",
  },
  auth: {
    login: "/auth/login",
    validateToken: "/auth/validate-token",
    validateReferral: "/auth/validate-referral",
  },
  agents: {
    launch: "/agents/launch",
    launchV2: "/leaderboard/api/v1/launch",
    agent: "/agents/:agent_id",
    pumpfun: "/agents/pumpfun/:agent_id",
    twitteroauth1: "/agents/twitter-oauth1",
    reconnectTwitter: "/agents/reconnect/twitter",
    validateoauth1: "/agents/twitter/validate-oauth1",
    fetchCoinsHeldByAgentId: "/agents/:agent_id",
    createAndBuyXAgent: "/agents/launch-token",
  },
  coins: {
    transactions: "/coins/transactions",
    trade: "/leaderboard/api/v1/trade",
  },
  chat: {
    send: "/chat/send",
    fetch: "/chat/fetch/:agent_id",
    activity: "/leaderboard/api/v1/activity",
  },
  profile: {
    fetchByPublicKey: "/profile/get/:public_key",
    fetchByUserName: "/profile/get/username/:username",
    fetchCoinsByPublicKey: "/profile/coins/createdby/:public_key",
  },
});
