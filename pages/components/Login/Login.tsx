import React, { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

import { SiweMessage } from "siwe";

import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";

const domain = window.location.host;
const origin = window.location.origin;
const API_URL = "https://impact-api-bepw.vercel.app";

const AuthPage = () => {
  const [messageSigned, setmessageSigned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { data, signMessageAsync } = useSignMessage();

  const createSiweMessage = async (address:`0x${string}`, statement:string) => {
    const res = await fetch(`${API_URL}/nonce/` + address, {
      credentials: "include",
    });
    console.log("res :>> ", res.body);
    console.log("origin :>> ", origin);
    let temp = await res.text();
    const message = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: "1",
      chainId: 1,
      nonce: temp,
    });
    return message.prepareMessage();
  };

  const signInWithEthereum = async () => {
    if(!address)
    return;
    setIsLoading(true);
    setmessageSigned(true);
    console.log("1");
   

    const message = await createSiweMessage(
      address,
      "Sign in with Ethereum to the app."
    );
    const signature = await signMessageAsync({ message });
    console.log("a", message);
    console.log("b", signature);
    const res = await fetch(`${API_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message, signature: signature }),
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
      <button
        onClick={() => {
          signInWithEthereum();
        }}
      />

      {/* <button onClick={goToDashboard}> */}
      {/* go to dashboard */}
      {/* </button> */}
    </div>
  );
};

export default AuthPage;
