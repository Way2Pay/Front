import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../state/atoms";
import { useAccount, useNetwork, useWalletClient } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { chainIdToRPC, domainToChainID, chainToDomainId } from "../utils/utils";
import { SdkBase, SdkConfig, create } from "@connext/sdk";
import "../destabi.json";
import { WalletClient, parseEther } from "viem";

export const useConnext = () => {
  const [sdkBase, setSDKBase] = useState<SdkBase>();
  const [auth, setAuth] = useRecoilState(authState);
  const { chain } = useNetwork();
  const { address } = useAccount();

  useEffect(() => {
    console.log;
    if (!auth.accessToken)
      setAuth({ ...auth, accessToken: localStorage.getItem("accessToken") });
  }, []);
  const { data: client, isError, isLoading } = useWalletClient();

  useEffect(() => {
    const initServices = async () => {
      if (client && address) {
        const sdkConfig: SdkConfig = {
          signerAddress: address,
          network: "testnet" as const,
          chains: {
            1869640809: {
              providers: [chainIdToRPC(domainToChainID("1869640809"))],
            },
            1886350457: {
              providers: [chainIdToRPC(domainToChainID("1886350457"))],
            },
            1634886255: {
              providers: [chainIdToRPC(domainToChainID("1634886255"))],
            },
            6450786: {
              providers: [chainIdToRPC(domainToChainID("6450786"))],
            },
            1735353714: {
              providers: [chainIdToRPC(domainToChainID("1735353714"))],
            },
            9991: {
              providers: [chainIdToRPC(domainToChainID("9991"))],
            },
            1735356532:{
              providers: [chainIdToRPC(domainToChainID("1735356532"))]
            }
          },
        };
        console.log("FLAG 1")
        const { sdkBase: data, sdkUtils: data2 } = await create(sdkConfig);
        setSDKBase(data);
      }
    };

    initServices();
  }, [client]);

  async function sendConnext(
    token: string,
    txId: string,
    destination: number,
    toAddress: string,
    amount:number,
  ) {
    console.log("FLAG2",token)
    let abiData = require("../destabi.json");
    const poolFee = 3000;

    const forwardCallData = ethers.utils.defaultAbiCoder.encode(
      ["string"],
      [ txId]
    );

    if (!chain) return;
    const relayerFee = (
      await sdkBase?.estimateRelayerFee({
        originDomain: chainToDomainId(chain.id),
        destinationDomain: chainToDomainId(destination),
      })
    )?.toString();

    console.log("RELAYER",relayerFee)
    const xcallParams = {
      origin: chainToDomainId(chain.id), // send from Mumbai
      destination: chainToDomainId(destination), // to Goerli
      to: toAddress, // the address that should receive the funds on destination
      asset: token, // address of the token contract
      amount: parseEther(amount.toString()).toString(), // amount of tokens to transfer
      slippage: 500, // the maximum amount of slippage the user will accept in BPS (e.g. 30 = 0.3%)
      callData: forwardCallData, // empty calldata for a simple transfer (byte-encoded)
      relayerFee: relayerFee, // fee paid to relayers
    };

    console.log("AHAS",chainToDomainId(chain.id),token,parseEther(amount.toString()).toString())
    const approveTxReq = await sdkBase?.approveIfNeeded(
      chainToDomainId(chain.id),
      token,
      parseEther(amount.toString()).toString(),
    );

    function walletClientToSigner(walletClient: WalletClient) {
      const { account, chain, transport } = walletClient;
      if (!chain) {
        return null;
      }
      const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      };

      const provider = new ethers.providers.Web3Provider(transport, network);
      const signer = provider.getSigner(account?.address);
      return signer;
    }

    const signer = client ? walletClientToSigner(client) : null;

    if (approveTxReq) {
      const approveTxReceipt = await signer?.sendTransaction(approveTxReq);
      await approveTxReceipt?.wait();
    }

    const xcallTxReq = await sdkBase?.xcall(xcallParams)!;
    console.log(xcallTxReq);
    xcallTxReq.gasLimit = BigNumber.from("400000");
    const xcallTxReceipt = await signer?.sendTransaction(xcallTxReq);
    console.log(xcallTxReceipt);
    await xcallTxReceipt?.wait();
  }

  return [sendConnext];
};
