import { NextApiRequest, NextApiResponse } from "next";
import chainsTokens from "../../../context/chainTokens";
import { useBalance } from "wagmi";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const address = req.body.address; // Assuming you're sending this in the POST body
  const chainId = req.body.chainId; // Get chainId from the request
  const tokenBalances: Record<string, string> = {};
  const { address, isConnecting, isDisconnected } = useAccount();

  const fetchTokenBalance = async (tokenAddress: string) => {
    if (!chainId || !address) return;

    const balanceResponse = await useBalance({
      address: address,
      token: tokenAddress as `0x${string}`,
      chainId: chainId,
    });

    const actualBalance = balanceResponse.data
      ? balanceResponse.data.formatted
      : "0";

    tokenBalances[tokenAddress] = actualBalance;
  };

  const chainData = chainsTokens.find((ch) => ch.chainId === chainId);
  if (chainData && chainData.tokens) {
    for (const tokenInfo of chainData.tokens) {
      await fetchTokenBalance(tokenInfo.address);
    }
  }

  res.status(200).json(tokenBalances);
};
