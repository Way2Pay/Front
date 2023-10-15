export interface Chain {
  name: string;
  gasPrice: string;
}

export const chains: Chain[] = [
  { name: "MATIC_MUMBAI", gasPrice: "100 Gwei" },
  { name: "ETH_GOERLI", gasPrice: "10 Gwei" },
  { name: "Scroll", gasPrice: "1 Gwei" },
];
