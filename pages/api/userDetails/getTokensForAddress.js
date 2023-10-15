// pages/api/getTokens.js

const { Alchemy, Network } = require("alchemy-sdk");

const config = {
  apiKey: "p_8TTJRyYwfCa8jAEJwuyJ9pC7mBGQFe",
  network: Network.MATIC_MUMBAI,
};
const alchemy = new Alchemy(config);

export default async function handler(req, res) {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Address is missing" });
  }

  try {
    // Get token balances
    const balances = await alchemy.core.getTokenBalances(address);

    // Remove tokens with zero balance
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== "0";
    });

    const tokensData = [];

    for (let token of nonZeroBalances) {
      let balance = token.tokenBalance;

      // Get metadata of token
      const metadata = await alchemy.core.getTokenMetadata(
        token.contractAddress
      );
      balance = balance / Math.pow(10, metadata.decimals);
      balance = balance.toFixed(2);

      tokensData.push({
        name: metadata.name,
        balance: balance,
        symbol: metadata.symbol,
      });
    }

    return res.status(200).json(tokensData);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch token balances" });
  }
}
