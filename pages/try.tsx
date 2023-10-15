import React, { useState, useEffect } from "react";
import { SiweMessage, generateNonce } from "siwe";
import { useAccount, useSignMessage } from "wagmi";
import { NextPage } from "next";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Login: NextPage = () => {
  const { address } = useAccount();

  async function ghi(txId:string,txHash: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/`+txId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({txHash:txHash}),
        credentials: "include",
      });
      const data = await res.json();
      console.log("GDONE", data);
  }


  async function def(txId: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/transaction/` + txId
    );
    console.log("GG", await res.json());
  }

  
  async function abc() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address: address, amount: "30", buyer: address }),
      credentials: "include",
    });
    const data = await res.json();
    console.log("GHER", data);
    await def(data.id);
    await ghi(data.id,"1234");
  }
  return (
    <div>
      <button
        onClick={() => {
          abc();
        }}
      >
        Click me
      </button>
    </div>
  );
};

export default Login;
