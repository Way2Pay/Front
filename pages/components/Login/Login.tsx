import React, { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { SiweMessage, generateNonce } from "siwe";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { NextPage } from "next";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";

const API_URL = "http://localhost:3000/api";
const domain = "http://localhost:3000";

const Login: NextPage = () => {
  const [messageSigned, setmessageSigned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { data, signMessageAsync } = useSignMessage();
  const nonce = generateNonce();
  console.log("HE", nonce);
  const createSiweMessage = async (
    address: `0x${string}`,
    statement: string
  ) => {
    const res = await fetch(`${API_URL}/nonce/`+address);
    console.log("res :>> ", res.body);
    console.log("origin :>> ", origin);
    let temp = await res.json();
    console.log("HERE", temp);
    const message = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: "1",
      chainId: 1,
      nonce: temp.nonce,
    });
    return message.prepareMessage();
  };

  const signInWithEthereum = async () => {
    if (!address) return;
    setIsLoading(true);
    setmessageSigned(true);
    console.log("1");

    const message = await createSiweMessage(
      address,
      "Sign in with Ethereum to the app."
    );
  };
  // useEffect(() => {
  // 	messageSigned && goToDashboard()
  // 	// eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [goToDashboard])

  return (
    <div>
      <div>AAASASDSADSADASDZXCZXDSAD</div>
      <ConnectButton />
      <button
        onClick={() => {
          signInWithEthereum();
        }}
      >
        ClickMe
      </button>

      {/* <button onClick={goToDashboard}> */}
      {/* go to dashboard */}
      {/* </button> */}
    </div>
  );
};

export default Login;
