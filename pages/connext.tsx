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
import { SdkConfig, create } from "@connext/sdk";
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
  const { switchNetwork } = useSwitchNetwork();

  const [auth,setAuth]= useRecoilState(authState)
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [confirmedChain, setConfirmedChain] = useState<string | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [confirmedCoin, setConfirmedCoin] = useState<string | null>(null);
  const { openConnectModal } = useConnectModal();
  const [chainId, setChainId] = useState(1);
  const { address, isConnecting, isDisconnected } = useAccount();
  console.log("auth",auth)
  const disconnectWallet = () => {
    disconnect();
  };

  useEffect(()=>{
    console.log
    if(!auth.accessToken)
    setAuth({...auth,accessToken:localStorage.getItem('accessToken')})
  },[])

//   useEffect(() => {
//     const abc = async () => {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`);
//       console.log(await res.json())
//     };
//     abc();
//   });


  


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
  const fetchedTokens = [
    { name: "Ethereum", price: "2000" },
    { name: "Bitcoin", price: "40000" },
    { name: "Cardano", price: "1.5" },
    // ... add more tokens as needed
  ];

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
        const {sdkBase} =await create(sdkConfig);
        const poolFee = await getPoolFeeForUniV3(chainToDomainId(chainNameToIdMap[selectedChain || ""]),  "0x7af963cF6D228E564e2A0aA0DdBF06210B38615D", "0xdD69DB25F6D620A7baD3023c5d32761D353D3De9", chainIdToRPC(chainNameToIdMap[selectedChain || ""]),);

      }
    };

    initServices();
  }, [client]);

  async function deployContract() {
    let abiData = require("../destabi.json");

    
    
    console.log(poolFee);
    const factory = new ContractFactory(abiData["abi"], abiData["bytecode"]);
    
  }

  return (
    <div>
      <button onClick={()=>{deployContract()}}>ClickMe</button>
    </div>
  );
}

export default dynamic(() => Promise.resolve(DeployWelcome), { ssr: false });
