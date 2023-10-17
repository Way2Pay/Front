import React, { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { authState } from "../../state/atoms";
import { useRecoilState } from "recoil";
import { SiweMessage, generateNonce } from "siwe";
import { useAccount, useWalletClient, useSignMessage } from "wagmi";
import { NextPage } from "next";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { PushAPI } from "@pushprotocol/restapi";
import { useRouter } from "next/navigation";
import { PushContext } from "../../pages/_app";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
const Login: NextPage = () => {
  const { userPPP, setUserPPP } = useContext(PushContext);
  const router = useRouter();
  const [auth, setAuth] = useRecoilState(authState);
  const { data: client } = useWalletClient();
  const [messageSigned, setmessageSigned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected, isDisconnected } = useAccount();
  const { data, signMessageAsync } = useSignMessage();
  const nonce = generateNonce();

  console.log(auth);
  const [domain, setDomain] = useState("");
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setDomain(window.location.host);
    setOrigin(window.location.origin);
    if (!auth.accessToken)
      setAuth({ ...auth, accessToken: localStorage.getItem("accessToken") });
  }, []);
  console.log("HEY", origin, domain);
  console.log("HE", nonce);
  const createSiweMessage = async (address: string, statement: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/nonce/` + address
    );
    console.log("res :>> ", res.body);
    console.log("origin :>> ", origin);
    console.log("domain", domain);
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
    console.log("Message", message);
    try {
      const signature = await signMessageAsync({ message });
      console.log("a", message);
      console.log("b", signature);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          message: message,
          signature: signature,
        }),
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      client;
      if (typeof window !== undefined && client) {
        let userAlice = await PushAPI.initialize(client, { env: ENV.STAGING });
        setUserPPP(userAlice);
        console.log("updating accesstoken");
        localStorage.setItem("accessToken", data.token);
        setAuth({ ...auth, accessToken: data.token });
      }
    } catch (err) {
      console.log("User denied Signature");
    }
  };
  // useEffect(() => {
  // 	messageSigned && goToDashboard()
  // 	// eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [goToDashboard])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 "></div>
      <div className="bg-white p-8 z-10 text-center relative items-center">
        {/* Main Content */}
        <h1 className="text-2xl font-semibold mb-4">Welcome Back!</h1>
        <p className="mb-6 text-gray-600 text-lg">Please sign in to continue</p>

        <div className="flex items-center justify-center py-10">
          <ConnectButton />
        </div>

        {!auth.accessToken && (
          <div className="py-5">
            <button
              className="bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              onClick={signInWithEthereum}
            >
              Sign In With Ethereum
            </button>
          </div>
        )}
        {auth.accessToken && (
          <div className="grid grid-cols-2 gap-3">
            <button
              className="bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              onClick={() => router.push("/sellerDashboard")}
            >
              Go to Seller Dashboard
            </button>
            <button
              className="bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              onClick={() => router.push("/userDashboard")}
            >
              Go to User Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
