interface TokenInfo {
  name: string;
  address: `0x${string}`; // Use template literal type
  chain: string;
}

interface ChainTokens {
  chainId: number;
  tokens: TokenInfo[];
}
