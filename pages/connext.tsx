import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../state/atoms";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient } from "wagmi";
import { disconnect } from "@wagmi/core";
import dynamic from "next/dynamic";
import { useSwitchNetwork} from "wagmi";
import {BigNumber, ethers} from "ethers";
import {chainIdToRPC,domainToChainID,chainToDomainId,chainIdToChainName} from "../utils/utils";

import { SdkBase, SdkConfig, SdkUtils, create } from "@connext/sdk";
import {
  tokenAddresses,
  routerAddress,
} from "../context/chainTokenaddresses";
import { ContractFactory } from "ethers";
import "../destabi.json";
import { WalletClient } from "viem";
import { motion } from "framer-motion";
import { slideRight, slideUp } from "../context/motionpresets";
import ChainTable from "../components/ChainTable/ChainTable";
import CoinTable from "../components/CoinTable/CoinTableUser";

function DeployWelcome() {

  const [sdkBase, setSDKBase]=useState<SdkBase>()
  const [auth,setAuth]= useRecoilState(authState)
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [chainId, setChainId] = useState(1);
  const { address } = useAccount();
  const [utils, setUtils] = useState<SdkUtils>();
  console.log("auth",auth)

  useEffect(()=>{
    console.log
    if(!auth.accessToken)
    setAuth({...auth,accessToken:localStorage.getItem('accessToken')})
  },[])

  const chainNameToIdMap: { [key: string]: number } = {
    MATIC_MUMBAI: 80001,
    ETH_GOERLI: 5,
    // ... add other chains as necessary
  };
  const {
    data: client,
    isError,
    isLoading,
  } = useWalletClient();

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
          },
        };
        const {sdkBase:data, sdkUtils:data2} =await create(sdkConfig);
        setSDKBase(data)
        setUtils(data2)
      }
    };

    initServices();
  }, [client]);

  async function deployContract() {
    let abiData = require("../destabi.json");
    const poolFee = 3000;
  
    const forwardCallData = ethers.utils.defaultAbiCoder.encode(
      ["address"],
      ["0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"],
    );

    const relayerFee = (
      await sdkBase?.estimateRelayerFee({
        originDomain: "9991", 
        destinationDomain: "1735353714"
      })
    )?.toString();

    const xcallParams = {
      origin: "9991",           // send from Mumbai
      destination: "1735353714", // to Goerli
      to: "0x7E0BCCea5Ab00c7aE47cDd9052a1032406950261",              // the address that should receive the funds on destination
      asset: "0xeDb95D8037f769B72AAab41deeC92903A98C9E16",             // address of the token contract
      delegate: address,        // address allowed to execute transaction on destination side in addition to relayers
      amount: 100,                 // amount of tokens to transfer
      slippage: 100,             // the maximum amount of slippage the user will accept in BPS (e.g. 30 = 0.3%)
      callData: forwardCallData,                 // empty calldata for a simple transfer (byte-encoded)
      relayerFee: relayerFee,         // fee paid to relayers 
    };

    const approveTxReq = await sdkBase?.approveIfNeeded(
      "9991",
      "0xeDb95D8037f769B72AAab41deeC92903A98C9E16",
      "100"
    );

    function walletClientToSigner(walletClient: WalletClient) {
      const { account, chain, transport } = walletClient
      if(!chain ){
        return null;
      }
      const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
      }

      const provider = new ethers.providers.Web3Provider(transport, network)
      const signer = provider.getSigner(account?.address)
      return signer
    }

    
    const signer = client?walletClientToSigner(client) : null;

    if (approveTxReq) {
    

      const approveTxReceipt = await signer?.sendTransaction(approveTxReq);
      await approveTxReceipt?.wait();
    }

    const xcallTxReq = await sdkBase?.xcall(xcallParams)!;
    console.log(xcallTxReq);
    xcallTxReq.gasLimit = BigNumber.from("20000000"); 
    const xcallTxReceipt = await signer?.sendTransaction(xcallTxReq);
    console.log(xcallTxReceipt);
    await xcallTxReceipt?.wait();
    
  }

  return (
    <div>
      <button onClick={()=>{deployContract()}}>ClickMe</button>
    </div>
  );
}

export default dynamic(() => Promise.resolve(DeployWelcome), { ssr: false });

