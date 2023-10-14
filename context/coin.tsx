export interface Coin {
  name: string;
  symbol: string;
  price: string; // You can use a number type if you want to perform calculations on this
}

export const coins: Coin[] = [
  { name: "Bitcoin", symbol: "BTC", price: "$50,000" },
  { name: "Ethereum", symbol: "ETH", price: "$3,500" },
  { name: "Cardano", symbol: "ADA", price: "$2.50" },
  // ... add more coins as required
];