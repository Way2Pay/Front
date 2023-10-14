import React, { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { SiweMessage, generateNonce } from "siwe";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { NextPage } from "next";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";

const API_URL = "http://localhost:3000/api";
const domain = "localhost";
const origin = "https://localhost/login";

const Login: NextPage = () => {
  const [messageSigned, setmessageSigned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { data, signMessageAsync } = useSignMessage();
  const nonce = generateNonce();
  console.log("HE", nonce);
  const createSiweMessage = async (
    address: string,
    statement: string
  ) => {
    const res = await fetch(`${API_URL}/nonce/`+address);
    console.log("res :>> ", res.body);
    console.log("origin :>> ", origin);
    console.log("domain",domain)
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
      address.toString(),
      "Sign in with Ethereum to the app."
    );
    console.log("Message",message)
    const signature = await signMessageAsync({ message });
    console.log("a", message);
    console.log("b", signature);
    const res = await fetch(`${API_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address,message: message, signature: signature }),
      credentials: "include",
    });
    console.log(res);
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
