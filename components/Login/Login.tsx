import React, { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { authState } from "../../state/atoms";
import {useRecoilState} from "recoil"
import { SiweMessage, generateNonce } from "siwe";
import { useAccount, useWalletClient, useSignMessage } from "wagmi";
import { NextPage } from "next";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import {PushAPI} from "@pushprotocol/restapi"
import { useRouter } from "next/navigation";
import { PushContext } from "../../pages/_app";
import {ENV} from "@pushprotocol/restapi/src/lib/constants"
const Login: NextPage = () => {

  const {userPPP,setUserPPP} = useContext(PushContext);
  const router = useRouter();
  const [auth,setAuth] = useRecoilState(authState)
  const {data:client} = useWalletClient();
  const [messageSigned, setmessageSigned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { data, signMessageAsync } = useSignMessage();
  const nonce = generateNonce();

  console.log(auth)
  const [domain, setDomain] = useState("");
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setDomain(window.location.host);
    setOrigin(window.location.origin);
    if(!auth.accessToken)
    setAuth({...auth,accessToken:localStorage.getItem('accessToken')})
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
    try{
    const signature = await signMessageAsync({ message });
    console.log("a", message);
    console.log("b", signature);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address, message: message, signature: signature }),
      credentials: "include",
    });
    const data = await res.json()
    console.log(data);
        (client)
    if(typeof window !==undefined&&client)
    {

      let userAlice = await PushAPI.initialize(client, { env: ENV.STAGING });
    setUserPPP(userAlice)
    console.log("updating accesstoken")
    localStorage.setItem('accessToken',data.token)
    setAuth({...auth,accessToken:data.token})
    router.push("/dashboard")}
    }
    catch(err){
      console.log("User signature denied")
    }
    
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
