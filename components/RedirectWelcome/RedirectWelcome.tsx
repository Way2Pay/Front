import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Coin } from "../../context/coin";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { slideRight, slideUp } from "../../context/motionpresets";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { disconnect } from "@wagmi/core";
import {useConnext} from "../../hooks/useConnext"
import CoinTable from "../CoinTable/CoinTable";

const RedirectWelcome: NextPage = () => {
  const { chain } = useNetwork();
  const [fetchedTokens, setFetchedTokens] = useState<Coin[]>([]);
  const {sendConnext} = useConnext();
  const { openConnectModal } = useConnectModal();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [confirmedChain, setConfirmedChain] = useState<string | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [confirmedCoin, setConfirmedCoin] = useState<string | null>(null);
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (address) {
      fetch("/api/userDetails/getTokensForAddress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setFetchedTokens(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("There was an error fetching token balances:", error);
        });
    }
  }, [address]);

  const disconnectWallet = () => {
    disconnect();
  };

  const handleBackClick = () => {
    if (confirmedChain && !confirmedCoin) {
      setConfirmedChain(null);
    } else if (!confirmedChain) {
      disconnectWallet();
    }
  };

  const handleConfirmCoin = () => {
    if (!selectedCoin) return;

    setConfirmedCoin(selectedCoin);

    // Find the selected token object based on the coin name
    const selectedToken: Coin | undefined = fetchedTokens.find(
      (token: Coin) => token.name === selectedCoin
    );

    // Extract the chain name from the selected token object
    const selectedTokenChainName = selectedToken?.chain;

    if (!selectedTokenChainName || !switchNetwork) {
      console.error("Chain name not found or switchNetwork not available");
      return;
    }

    // Mapping from chain names to their respective chain IDs
    const chainNameToIdMap: { [key: string]: number } = {
      MATIC_MUMBAI: 80001,
      ETH_GOERLI: 5,
      // ... add other chains as necessary
    };

    // Get the chain ID based on the chain name
    const selectedTokenChainId = chainNameToIdMap[selectedTokenChainName];

    if (!selectedTokenChainId) {
      console.error("Chain ID not found for name:", selectedTokenChainName);
      return;
    }

    // Switch to the selected chain
    switchNetwork(selectedTokenChainId);
  };

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
                        <p className="text-2xl font-black tracking-tight text-black sm:text-4xl lg:text-8xl  ">
                          Choose!
                        </p>
                        <p className=" mt-4 font-thin tracking-tight text-gray-600 text-2xl mb-10">
                          select coin for your transactions{" "}
                        </p>
                      </motion.div>

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
};

export default dynamic(() => Promise.resolve(RedirectWelcome), { ssr: false });
