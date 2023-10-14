export interface Chain {
  name: string;
  gasPrice: string;
}

export const chains: Chain[] = [
  { name: "Ethereum", gasPrice: "100 Gwei" },
  { name: "Optimism", gasPrice: "10 Gwei" },
  { name: "Scroll", gasPrice: "1 Gwei" },
];
