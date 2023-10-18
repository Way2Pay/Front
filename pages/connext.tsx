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

class ConnextService {
    sdkConfig: SdkConfig;
  
    constructor(sdkConfig: SdkConfig) {
      this.sdkConfig = sdkConfig;
    }
  
    async estimateRelayerFee(originDomain: string, destinationDomain: string) {
      const { sdkBase } = await create(this.sdkConfig);
      const relayerFees = await sdkBase.estimateRelayerFee({
        originDomain,
        destinationDomain,
        isHighPriority: true,
      });
  
      return relayerFees.toString();
    }
  
    async getPoolFeeForUniV3(
      domainID: string,
      token0: string,
      token1: string,
      rpcUrl: string,
    ) {
      try {
        console.log(domainID,rpcUrl, token0, token1);
        const poolFee = await getPoolFeeForUniV3(
          domainID,
          rpcUrl,
          token0,
          token1,
        );
        
        return poolFee;
      } catch (err) {
        console.log(err);
        throw Error("Failed to fetch Pool Fees");
      }
    }
  
    async getXCallCallDataHelper(
      domainID: string,
      forwardCallData: string,
      params: DestinationCallDataParams,
    ) {
      const swapper = Swapper.UniV3;
      return getXCallCallData(domainID, swapper, forwardCallData, params);
    }
  
    getSwapAndXcallAddressHelper(domainID: string) {
      return getSwapAndXcallAddress(domainID);
    }
  
    async prepareSwapAndXCallHelper(
      swapAndXCallParams: SwapAndXCallParams,
      signerAddress: string,
    ) {
      // return prepareSwapAndXCall(swapAndXCallParams, signerAddress, {apiKey:"f5GTHProMkymbSTfaeRSJQXZxrpngQwK"});
  
      const res = await axios.post("/api/prepareswapandxcall", {
        swapAndXCallParams,
        signerAddress,
      });
      return res.data;
    }
  
    async getSupportedAssetsForDomain(chainId: number) {
      return getSupportedAssetsForDomain(chainId);
    }
  
    
  
  
    async getPriceImpactHelper(
      inputToken: string,
      inputDecimal: number,
      chainID: number,
      rpc: string,
      outputToken: string,
      outputDecimal: number,
      amountIn: BigNumberish,
      signerAddress: string,
    ) {
      try {
        const priceImpact = await getPriceImpactForSwaps(
          inputToken,
          inputDecimal,
          chainID,
          rpc,
          outputToken,
          outputDecimal,
          amountIn,
          signerAddress,
        );
        return priceImpact;
      } catch (err) {
        console.log(err);
      }
    }
  }

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
  const [connextService, setConnextService] = useState<
    ConnextService | undefined
  >(undefined);
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


  function getHeadingText() {
    if (!address || isDisconnected) {
      return {
        heading: "Let's Set You Up!",
        subheading: "Connect Your Wallet To Get Started..",
      };
    } else if (!confirmedChain) {
      return {
        heading: "Choose!",
        subheading: "Select a chain for receiving payments.",
      };
    } else if (confirmedChain && !confirmedCoin) {
      return {
        heading: "Almost There!",
        subheading: "Now, select a coin for receiving payments.",
      };
    } else {
      return {
        heading: "Ready to Go!",
        subheading: "Deploy to confirm your selections.",
      };
    }
  }
  const handleBackClick = () => {
    if (confirmedChain && confirmedCoin) {
      setConfirmedCoin(null);
    } else if (confirmedChain && !confirmedCoin) {
      setConfirmedChain(null);
    } else if (!confirmedChain) {
      disconnectWallet();
    }
  };

  const chainNameToIdMap: { [key: string]: number } = {
    MATIC_MUMBAI: 80001,
    ETH_GOERLI: 5,
    // ... add other chains as necessary
  };

  const handleConfirmChain = () => {
    setChainId(chainNameToIdMap[selectedChain || ""]);
    setConfirmedChain(selectedChain);

    // Mapping from chain names to their respective chain IDs

    const selectedChainId = chainNameToIdMap[selectedChain || ""];

    if (!selectedChainId || !switchNetwork) {
      console.error("Chain ID not found or switchNetwork not available");
      return;
    }

    // Switch to the selected chain
    setChainId(selectedChainId);
    switchNetwork(selectedChainId);
  };

  const handleConfirmCoin = () => {
    setConfirmedCoin(selectedCoin);
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
          network: "mainnet" as const,
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
        const connextServiceInstance = new ConnextService(sdkConfig);
        setConnextService(connextServiceInstance);
      }
    };

    initServices();
  }, [client]);

  async function deployContract() {
    console.log(connextService);
    let abiData = require("../destabi.json");

    const poolFee = await connextService?.getPoolFeeForUniV3(chainToDomainId(chainNameToIdMap[selectedChain || ""]),  "0x7af963cF6D228E564e2A0aA0DdBF06210B38615D", "0xdD69DB25F6D620A7baD3023c5d32761D353D3De9", chainIdToRPC(chainNameToIdMap[selectedChain || ""]),);
    
    console.log(poolFee);
    const factory = new ContractFactory(abiData["abi"], abiData["bytecode"]);
    
  }
  const { heading, subheading } = getHeadingText();

  return (
    <div>
      <section className="relative flex items-center w-full bg-black">
        <div className="relative items-center w-full px-5 py-24 mx-auto md:px-12 lg:px-16 max-w-7xl ">
          <div className="relative flex-col items-start m-auto align-middle bg-white p-20 rounded-xl  ">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-24">
              {address && !isDisconnected && (
                <div>
                  <button
                    onClick={handleBackClick}
                    className="absolute top-5 left-5 px-4 py-2 bg-gray-300 text-white rounded"
                  >
                    Back
                  </button>
                </div>
              )}

              <div className="relative items-center gap-12 m-auto lg:inline-flex md:order-first">
                <div className="max-w-xl text-center lg:text-left">
                  {address && !isDisconnected ? (
                    <>
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={slideRight}
                      >
                        <p className="text-2xl font-black tracking-tight text-black sm:text-4xl lg:text-8xl">
                          {heading}
                        </p>
                        <p className="max-w-xl mt-4 font-thin tracking-tight text-gray-600 text-2xl mb-10">
                          {subheading}
                        </p>
                      </motion.div>

                      {!confirmedChain && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={slideUp}
                        >
                          <ChainTable
                            selectedChain={selectedChain}
                            confirmedChain={confirmedChain}
                            setSelectedChain={setSelectedChain}
                            handleConfirmChain={handleConfirmChain}
                          />
                        </motion.div>
                      )}
                      {confirmedChain && !confirmedCoin && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={slideUp}
                        >
                          <CoinTable
                            coins={fetchedTokens}
                            selectedCoin={selectedCoin}
                            confirmedCoin={confirmedCoin}
                            setSelectedCoin={setSelectedCoin}
                            handleConfirmCoin={handleConfirmCoin}
                          />
                        </motion.div>
                      )}
                      {confirmedChain && confirmedCoin && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={slideUp}
                        >
                          <div className="flex items-center space-x-6 mt-10 w-full">
                            <button
                              onClick={deployContract}
                              className="px-10 w-full max-w-xs border-2 bg-slate-200 rounded-lg p-2 hover:bg-slate-300"
                            >
                              Deploy
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={slideRight}
                      >
                        <p className="max-w-xl mt-4 font-thin tracking-tight text-gray-600 text-2xl">
                          Connect Your Wallet To Get Started..
                        </p>
                        <p className="text-2xl font-black tracking-tight text-black sm:text-4xl lg:text-8xl ">
                          Let&apos;s Set You Up!
                        </p>
                      </motion.div>
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={slideUp}
                      >
                        <div className="flex items-center space-x-6 mt-10 w-full ">
                          <button
                            onClick={openConnectModal}
                            className="px-10 w-full max-w-xs border-2 bg-slate-200 rounded-lg p-2"
                          >
                            Connect Wallet
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
              <div className="order-first block w-full mt-12 aspect-square lg:mt-0">
                {address && !isDisconnected ? (
                  <div className=" w-full">
                    <ConnectButton />
                  </div>
                ) : null}
                <img
                  className="object-cover object-center w-full mx-auto bg-gray-300 lg:ml-auto mt-10 "
                  alt="hero"
                  src="../images/placeholders/square2.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default dynamic(() => Promise.resolve(DeployWelcome), { ssr: false });
