import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../state/atoms";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient } from "wagmi";
import { disconnect } from "@wagmi/core";
import dynamic from "next/dynamic";
import { useSwitchNetwork } from "wagmi";
import "axios";
import {chainIdToRPC,domainToChainID,chainToDomainId,chainIdToChainName} from "../utils/utils";
import {
    getPoolFeeForUniV3,
    getSwapAndXcallAddress,
    getXCallCallData,
    getSupportedAssetsForDomain,
    getPriceImpactForSwaps,
  } from "@connext/chain-abstraction";
  import {
    DestinationCallDataParams,
    Swapper,
    SwapAndXCallParams,
    EstimateQuoteAmountArgs,
  } from "@connext/chain-abstraction/dist/types";
import { SdkBase, SdkConfig, create } from "@connext/sdk";
import {
  tokenAddresses,
  routerAddress,
} from "../context/chainTokenaddresses";
import { ContractFactory } from "ethers";
import "../destabi.json";
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
  } = useWalletClient({ chainId: chainId });

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
          },
        };
        const {sdkBase:data} =await create(sdkConfig);
        setSDKBase(data)

      }
    };

    initServices();
  }, [client]);

  async function deployContract() {
    let abiData = require("../destabi.json");

    const factory = new ContractFactory(abiData["abi"], abiData["bytecode"]);
    
  }

  return (
    <div>
      <button onClick={()=>{deployContract()}}>ClickMe</button>
    </div>
  );
}

export default dynamic(() => Promise.resolve(DeployWelcome), { ssr: false });
