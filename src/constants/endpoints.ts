export const ApiEndpoints = Object.freeze({
  public: {
    feed: "/public/feed",
  },
  auth: {
    login: "/auth/login",
    validateToken: "/auth/validate-token",
  },
  agents: {
    launch: "/agents/launch",
  },
  coins: {
    transactions: "/coins/transactions",
  },
});
