import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../../state/atoms";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { disconnect } from "@wagmi/core";
import dynamic from "next/dynamic";
import { useSwitchNetwork } from "wagmi";
import { ContractFactory } from "ethers";
import "../../destabi.json";
import { motion } from "framer-motion";
import { slideRight, slideUp } from "../../context/motionpresets";
import ChainTable from "../ChainTable/ChainTable";
import CoinTable from "../CoinTable/CoinTableUser";
import { getContractAddress } from "viem";
import Navbar from "../HomePage/Navbar";
import { useRouter } from "next/router";
import { desiredTokensByChain, tokenSymbolToName } from "../../utils/utils";
import { useToast } from "@chakra-ui/react";
const DeployWelcome: NextPage = () => {
  const toast = useToast();
  const { switchNetwork } = useSwitchNetwork();

  const router = useRouter();
  const [auth, setAuth] = useRecoilState(authState);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [confirmedChain, setConfirmedChain] = useState<string | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [confirmedCoin, setConfirmedCoin] = useState<string | null>(null);
  const { openConnectModal } = useConnectModal();
  const [chainId, setChainId] = useState<number>();
  const publicClient = usePublicClient({ chainId: chainId });
  const { address, isConnecting, isDisconnected } = useAccount();
  console.log("auth", auth);
  const disconnectWallet = () => {
    disconnect();
  };

  useEffect(() => {
    console.log;
    if (!auth.accessToken)
      if (!localStorage.getItem("accessToken")?.length) {
        router.push("/login");
      }
    setAuth({ ...auth, accessToken: localStorage.getItem("accessToken") });
  }, []);

  type Coin = {
    name: string;
    symbol: string;
    address: string | `0x${string}`;
  };
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
    OPT_GOERLI: 420,
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
  useEffect(() => {
    if (selectedChain) {
      let data = desiredTokensByChain[selectedChain];
      let coinData = Object.keys(data).map((coin, index) => {
        return {
          name: data[coin],
          address: coin,
          symbol: tokenSymbolToName[data[coin]],
        };
      });
      console.log("HERE", coinData);
      setFetchedTokens(coinData);
    }
  }, [selectedChain]);

  const handleConfirmCoin = () => {
    setConfirmedCoin(selectedCoin);
  };
  const { data: client, isError, isLoading } = useWalletClient();
  const [fetchedTokens, setFetchedTokens] = useState<Coin[]>();

  const deployContract = async () => {
    let abiData = require("../../destabi.json");

    console.log(client);
    const gasLimit = BigInt("2000000");
    const factory = new ContractFactory(abiData["abi"], abiData["bytecode"]);
    try {
      toast({
        position:"top-right",
        title:"Deploying your Contract",
        description:"Your transaction has been submitted",
        status:"loading",
        isClosable:true,
        duration:5000,

      })
      const a = await client?.deployContract({
        abi: abiData["abi"],
        account: address,
        bytecode: abiData["bytecode"] as `0x${string}`,
        args: [confirmedCoin, "0xE592427A0AEce92De3Edee1F18E0157C05861564"],
        gas: gasLimit,
      });
      if (!a){ 
        return;
      }

      const receipt = await publicClient.waitForTransactionReceipt({ hash: a });
      console.log("RECEIPT", receipt);
      toast({
        position:'top-right',
        title: 'Contract Deployed',
        description: "Your contract is deployed. We'll update it in your profile",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      if (!address) return;
      const nonce = await publicClient.getTransactionCount({
        address: address,
      });
      const b = BigInt(nonce - 1);
      const contractAddress = await getContractAddress({
        from: address,
        nonce: b,
      });

      console.log("Address", contractAddress);
      
      const request = await fetch(process.env.NEXT_PUBLIC_API_URL + "/deploy", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chainId: chainId,
          coinAddress: confirmedCoin,
          contractAddress: contractAddress,
        }),
      });
      console.log(await request.json());
      toast({
        position:'top-right',
        title: 'Profile Updated',
        description: "Your contract is stored in your profile",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (err: unknown) {}
  };
  const { heading, subheading } = getHeadingText();

  return (
    <div>
      <Navbar />
      <section className="relative flex items-center w-full bg-white">
        <div className="relative items-center w-full px-5  mx-auto md:px-12 lg:px-16 ">
          <div className="relative flex-col items-start m-auto  bg-white p-20 rounded-xl  ">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12">
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
                      {confirmedChain && !confirmedCoin && fetchedTokens && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={slideUp}
                        >
                          <CoinTable
                            coins={fetchedTokens}
                            selectedChain={confirmedChain}
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
              <div className="order-first block w-full mt-12 aspect-square  ">
                {address && !isDisconnected ? (
                  <div className=" w-full">
                    <ConnectButton />
                  </div>
                ) : null}
                <img
                  className="object-cover object-center w-full mx-auto  lg:ml-auto mt-10 "
                  src="hero.png"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default dynamic(() => Promise.resolve(DeployWelcome), { ssr: false });
