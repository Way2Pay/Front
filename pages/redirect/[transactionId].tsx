"use client";
import { NextPage } from "next";
import RedirectWelome from "../../components/RedirectWelcome/RedirectWelcome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import myHero from "../../public/hero.png"


const Redirect: NextPage = () => {
const router = useRouter();
const [txId,setTxId]=useState<string>();
useEffect(()=>{
  if(typeof router.query.transactionId==="string")
  {
    setTxId(router.query.transactionId)
  }
},[router.query.transactionId])
  return (
    <>
      <RedirectWelome txId={txId} hero={myHero}/>
    </>
  );
};

export default Redirect;
