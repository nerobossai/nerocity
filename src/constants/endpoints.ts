export const ApiEndpoints = Object.freeze({
  public: {
    feed: "/public/feed",
    overlord: "/public/overlord",
  },
  auth: {
    login: "/auth/login",
    validateToken: "/auth/validate-token",
  },
  agents: {
    launch: "/agents/launch",
    agent: "/agents/:agent_id",
  },
  coins: {
    transactions: "/coins/transactions",
  },
  chat: {
    send: "/chat/send",
    fetch: "/chat/fetch/:agent_id",
  },
});
