export const getErrorMessageFromAxios = (err: any) => {
  return new Error(err?.response?.data?.message || "Something went wrong!");
};
