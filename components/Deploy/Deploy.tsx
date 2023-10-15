import { NextPage } from "next";
import React, { useState } from "react";

import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient } from "wagmi";
import { disconnect, getWalletClient } from "@wagmi/core";
import dynamic from "next/dynamic";
import { useSwitchNetwork } from "wagmi";
import {
  tokenAddresses,
  routerAddress,
} from "../../context/chainTokenaddresses";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { ContractFactory } from "ethers";
import "../../destabi.json";
import { motion } from "framer-motion";
import { slideRight, slideUp } from "../../context/motionpresets";
import { useConnect } from "wagmi";
import ChainTable from "../ChainTable/ChainTable";
import CoinTable from "../CoinTable/CoinTableUser";
function DeployWelcome() {
  const { switchNetwork } = useSwitchNetwork();

  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [confirmedChain, setConfirmedChain] = useState<string | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [confirmedCoin, setConfirmedCoin] = useState<string | null>(null);
  // const { address, isConnecting, isDisconnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [chainId, setChainId] = useState(5);
  const { address, isConnecting, isDisconnected } = useAccount();
  const disconnectWallet = () => {
    disconnect();
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

  const handleConfirmChain = () => {
    setConfirmedChain(selectedChain);

    // Mapping from chain names to their respective chain IDs
    const chainNameToIdMap: { [key: string]: number } = {
      MATIC_MUMBAI: 80001,
      ETH_GOERLI: 5,
      // ... add other chains as necessary
    };

    const selectedChainId = chainNameToIdMap[selectedChain || ""];

    if (!selectedChainId || !switchNetwork) {
      console.error("Chain ID not found or switchNetwork not available");
      return;
    }

    // Switch to the selected chain
    switchNetwork(selectedChainId);
  };

  const handleConfirmCoin = () => {
    setConfirmedCoin(selectedCoin);
  };
  const {
    data: walletClient,
    isError,
    isLoading,
  } = useWalletClient({ chainId: chainId });
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),

    chainId: 5,
  });
  const fetchedTokens = [
    { name: "Ethereum", price: "2000" },
    { name: "Bitcoin", price: "40000" },
    { name: "Cardano", price: "1.5" },
    // ... add more tokens as needed
  ];

  async function deployContract() {
    let abiData = require("../../destabi.json");
    const client = await getWalletClient({ chainId: 5 });
    console.log(client);
    const factory = new ContractFactory(abiData["abi"], abiData["bytecode"]);
    const a = await client?.deployContract({
      abi: abiData["abi"],
      account: address,
      bytecode: abiData["bytecode"] as `0x${string}`,
      args: [
        "0x7ea6eA49B0b0Ae9c5db7907d139D9Cd3439862a1",
        "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      ],
    });
    console.log(a);
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
