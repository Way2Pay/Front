"use client";
import { NextPage } from "next";
import RedirectWelome from "../../components/RedirectWelcome/RedirectWelcome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



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
      <RedirectWelome txId={txId}/>
    </>
  );
};

export default Redirect;
