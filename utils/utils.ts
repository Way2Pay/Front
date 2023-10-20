// This file is very specific to connext protocol.
// For more reference go to https://docs.connext.network/

import { Network } from "alchemy-sdk";
type DomainID = {
  [key: number]: string;
};
type ChainID = {
  [key: string]: number;
};
type CoinAddresses = {
  [key: string]: string;
};
export const chainIdToRPC = (chainId: number) => {
  // Need to add more RPCs according to chains
  const chainToRPC: DomainID = {
    10: "https://rpc.ankr.com/optimism",
    137: "https://polygon.llamarpc.com",
    42161: "https://arb-mainnet-public.unifra.io",
    56: "https://bsc.rpc.blxrbdn.com",
    5: "https://goerli.drpc.org/",
  };

  return chainToRPC[chainId];
};

export const domainToChainID = (domain: string) => {
  const domainToChain: ChainID = {
    "1869640809": 10,
    "1886350457": 137,
    "1634886255": 42161,
    "6450786": 56,
    "6648936": 1,
    "1735353714": 5,
  };
  return domainToChain[domain];
};

export const chainToDomainId = (chainId: number) => {
  const domainToChain: DomainID = {
    1: "6648936",
    10: "1869640809",
    137: "1886350457",
    42161: "1634886255",
    56: "6450786",
    5: "1735353714",
  };
  return domainToChain[chainId];
};

export const chainNameToIdMap: { [key: string]: number } = {
  MATIC_MUMBAI: 80001,
  ETH_GOERLI: 5,
  OPT_GOERLI: 420,
  // ... add other chains as necessary
};

export const alchemyConfigs = [
  {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_MATIC_MUMBAI,
    network: Network.MATIC_MUMBAI,
    name: "MATIC_MUMBAI",
  },
  {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ETH_GOERLI,
    network: Network.ETH_GOERLI,
    name: "ETH_GOERLI",
  },
  {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_OPT_GOERLI,
    network: Network.OPT_GOERLI,
    name: "OPT_GOERLI",
  },
];

export const tokenSymbolToName: { [key: string]: string } = {
  USDT: "USD Tether",
  USDC: "USD Coin",
  WETH: "Wrapped Ether",
  TEST: "Test Token",
};

export const chainToChainName:{[key:string]:string}={
  MATIC_MUMBAI:"POLYGON MUMBAI",
  ETH_GOERLI:"ETHEREUM GOERLI",
  OPT_GOERLI:"OPTIMIST GOERLI",
}
export const desiredTokensByChain: { [key: string]: CoinAddresses } = {
  MATIC_MUMBAI: {
    "0x52D800ca262522580CeBAD275395ca6e7598C014": "USDC",
    "0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2": "USDT",
    "0xc199807AF4fEDB02EE567Ed0FeB814A077de4802": "WETH",
    "0xeDb95D8037f769B72AAab41deeC92903A98C9E16": "TEST",
  },
  ETH_GOERLI: {
    "0x9FD21bE27A2B059a288229361E2fA632D8D2d074": "USDC",
    "0x65E2fe35C30eC218b46266F89847c63c2eDa7Dc7": "USDT",
    "0xCCa7d1416518D095E729904aAeA087dBA749A4dC": "WETH",
    "0x7ea6eA49B0b0Ae9c5db7907d139D9Cd3439862a1": "TEST",
  },
  OPT_GOERLI: {
    "0x69529987fa4a075d0c00b0128fa848dc9ebbe9ce": "USDC",
    "0xf79129ae303764d79287fff0c857003e95fc1506": "USDT",
    "0x4778caf7b5dbd3934c3906c2909653eb1e0e601f": "WETH",
    "0x68Db1c8d85C09d546097C65ec7DCBFF4D6497CbF": "TEST",
  },
};

export const desiredTokensByChainRev: { [key: string]: CoinAddresses } = {
  MATIC_MUMBAI: {
    USDC: "0x52D800ca262522580CeBAD275395ca6e7598C014",
    USDT: "0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2",
    WETH: "0xc199807AF4fEDB02EE567Ed0FeB814A077de4802",
    TEST: "0xeDb95D8037f769B72AAab41deeC92903A98C9E16",
  },
  ETH_GOERLI: {
    USDC: "0x9FD21bE27A2B059a288229361E2fA632D8D2d074",
    USDT: "0x65E2fe35C30eC218b46266F89847c63c2eDa7Dc7",
    WETH: "0xCCa7d1416518D095E729904aAeA087dBA749A4dC",
    TEST: "0x7ea6eA49B0b0Ae9c5db7907d139D9Cd3439862a1",
  },
  OPT_GOERLI: {
    USDC: "0x69529987fa4a075d0c00b0128fa848dc9ebbe9ce",
    USDT: "0xf79129ae303764d79287fff0c857003e95fc1506",
    WETH: "0x4778caf7b5dbd3934c3906c2909653eb1e0e601f",
    TEST: "0x68Db1c8d85C09d546097C65ec7DCBFF4D6497CbF",
  },
};

// Specific to covalent API
