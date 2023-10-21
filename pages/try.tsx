"use client";
import Login from "../components/Login/Login";
import { NextPage } from "next";
import RedirectWelome from "../components/RedirectWelcome/RedirectWelcome";
import { useEffect } from "react";
import {getTxId} from "../frontend-services/graphServices"
const Redirect: NextPage = () => {

    useEffect(()=>{
        const abc = async()=>{
           const data = await getTxId("0xf772ddf14bf52c1d06a3e1c77bf6c422c7567afa0cd85edb74cbf839d155cc13",80001)
           console.log("SSS",data)
          
        }
        abc();
    },[])
  return (
    <>
      HI
    </>
  );
};

export default Redirect;
