export const truncateString = (
  str: string,
  maxLen: number = 13,
  prefix: number = 4,
  suffix: number = 4,
) => {
  try {
    if (str.length > maxLen) {
      return `${str.slice(0, prefix)}...${str.slice(
        str.length - suffix,
        str.length,
      )}`;
    }
    return str;
  } catch (err) {
    return str;
  }
};
