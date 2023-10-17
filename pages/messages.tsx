"use client";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import DeployWelcome from "../components/Deploy/Deploy";
import { PushAPI } from '@pushprotocol/restapi';
import {ENV} from '@pushprotocol/restapi/src/lib/constants'
import { useWalletClient } from "wagmi";
import {STREAM} from "@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes"
// PushAPI.initialize(signer, {options?});
// signer - pass the signer from your app and set env to 'prod' for mainnet app
// options? - optional, can pass initialization parameters for customization 
const Deploy: NextPage = () => {


    const [userPPP,setUserPPP]= useState<PushAPI>();
    const {data:client} = useWalletClient();
    const initializePush = async () => {
        if (client) {
          let userAlice = await PushAPI.initialize(client, { env: ENV.STAGING });
          userAlice.stream.on(STREAM.CHAT, (data: any) => {
            console.log(data);
          });
          setUserPPP(userAlice);
        }
      };
    useEffect(()=>{
        initializePush();
    },[])
  return (
    <>
      <DeployWelcome />
    </>
  );
};

export default Deploy;
