const { Alchemy, Network } = require("alchemy-sdk");

// Multiple chain configurations
const configs = [
  {
    apiKey: "x7uHGTcZpefmAG624XyTaJRgXksnMlzc",
    network: Network.MATIC_MUMBAI,
    name: "MATIC_MUMBAI",
  },
  {
    apiKey: "97QAFe9DJaGdJFjit3ye-64rNlYK5pLd",
    network: Network.ETH_GOERLI,
    name: "ETH_GOERLI",
  },
  {
    apiKey: "o3o0J-G8ILdpPT1RCi9WGj_V-c48mZ5t",
    network: Network.OPT_GOERLI,
    name: "OPT_GOERLI",
  },
];
const desiredTokensByChain = {
  MATIC_MUMBAI: {
    "0x52D800ca262522580CeBAD275395ca6e7598C014": "USDC",
    "0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2": "USDT",
    "0xc199807AF4fEDB02EE567Ed0FeB814A077de4802": "WETH",
  },
  ETH_GOERLI: {
    "0x9FD21bE27A2B059a288229361E2fA632D8D2d074": "USDC",
    "0x65E2fe35C30eC218b46266F89847c63c2eDa7Dc7": "USDT",
    "0xCCa7d1416518D095E729904aAeA087dBA749A4dC": "WETH",
  },
  OPT_GOERLI: {
    "0x69529987fa4a075d0c00b0128fa848dc9ebbe9ce": "USDC",
    "0xf79129ae303764d79287fff0c857003e95fc1506": "USDT",
    "0x4778caf7b5dbd3934c3906c2909653eb1e0e601f": "WETH",
  },
};

async function fetchTokensForChain(config, address) {
  const alchemy = new Alchemy(config);

  // Extract the contract addresses for the current chain
  const desiredContractAddresses = Object.keys(
    desiredTokensByChain[config.name]
  );

  let balances;
  try {
    balances = await alchemy.core.getTokenBalances(
      address,
      desiredContractAddresses
    );
  } catch (error) {
    console.error(`Error fetching balances for ${config.name}:`, error.message);
    throw error;
  }

  // Fetching metadata for each token
  const metadataPromises = balances.tokenBalances.map((token) =>
    alchemy.core.getTokenMetadata(token.contractAddress)
  );
  const metadataArray = await Promise.all(metadataPromises);

  const tokensData = balances.tokenBalances
    .map((token, index) => {
      const metadata = metadataArray[index];
      let balance = token.tokenBalance;
      if (metadata && metadata.decimals) {
        balance = balance / Math.pow(10, metadata.decimals);
      }
      balance = parseFloat(balance.toFixed(2));

      return {
        name: metadata
          ? metadata.name
          : desiredTokensByChain[config.name][token.contractAddress],
        balance: balance,
        symbol: metadata ? metadata.symbol : token.contractAddress,
        chain: config.name,
      };
    })
    .filter((token) => token.balance > 0); // Filtering out tokens with zero balance

  return tokensData;
}

export default async function handler(req, res) {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Address is missing" });
  }

  try {
    // Fetch data for all chains concurrently
    const results = await Promise.all(
      configs.map((config) => fetchTokensForChain(config, address))
    );

    // Flatten the results into a single array
    const tokensData = [].concat(...results);

    return res.status(200).json(tokensData);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch token balances" });
  }
}
