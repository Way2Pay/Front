const { Alchemy, Network } = require("alchemy-sdk");
import {alchemyConfigs, desiredTokensByChain} from "../../../utils/utils"
// Multiple chain configurations

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
      alchemyConfigs.map((config) => fetchTokensForChain(config, address))
    );

    // Flatten the results into a single array
    const tokensData = [].concat(...results);

    return res.status(200).json(tokensData);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch token balances" });
  }
}
