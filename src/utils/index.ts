export const getSolScanLink = (address: string) => {
  return `https://solscan.io/account/${address}`;
};

export const getGeckoterminalLink = (address: string) => {
  return `https://www.geckoterminal.com/solana/pools/${address}`;
};

export const getRaydiumLink = (address: string) => {
  return `https://raydium.io/swap/?inputMint=sol&outputMint=${address}`;
};

export const toFixedNumber = (num: number, digits: number, base?: number) => {
  const pow = (base ?? 10) ** digits;
  return Math.round(num * pow) / pow;
};
