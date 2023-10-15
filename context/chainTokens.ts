interface TokenInfo {
  name: string;
  address: `0x${string}`; // Use template literal type
}

interface ChainTokens {
  chainId: number;
  tokens: TokenInfo[];
}

const chainsTokens: ChainTokens[] = [
  {
    chainId: 1, // Ethereum Mainnet
    tokens: [
      { name: "UNI", address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984" },
      { name: "USDC", address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" },
      { name: "USDT", address: "0xdac17f958d2ee523a2206206994597c13d831ec7" },
      { name: "DAI", address: "0x6b175474e89094c44da98b954eedeac495271d0f" },
      { name: "WBTC", address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599" },
      // ... add other tokens for Ethereum Mainnet
    ],
  },

  {
    chainId: 3, // Ropsten Testnet
    tokens: [
      { name: "TestToken1", address: "0xsomeaddress1" },
      { name: "TestToken2", address: "0xsomeaddress2" },
      // ... other tokens for Ropsten Testnet
    ],
  },
  {
    chainId: 4, // Rinkeby Testnet
    tokens: [
      { name: "TestTokenA", address: "0xsomeaddressA" },
      // ... other tokens for Rinkeby Testnet
    ],
  },
  // ... add other chains and their tokens as needed
];

export default chainsTokens;
