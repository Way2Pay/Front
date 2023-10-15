export interface Coin {
  name: string;
  symbol: string;
  price?: string;
  balance?: string;
}

export const coins: Coin[] = [
  { name: "Bitcoin", symbol: "BTC", price: "$50,000" },
  { name: "Ethereum", symbol: "ETH", price: "$3,500" },
  { name: "Cardano", symbol: "ADA", price: "$2.50" },
  // ... add more coins as required
];
