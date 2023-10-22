"use client";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import {PushAPI} from "@pushprotocol/restapi"
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  base,
  zora,
  polygonMumbai,
  optimismGoerli,
} from "wagmi/chains";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { publicProvider } from "wagmi/providers/public";
import { createContext, useContext, useState } from "react";
import {ChakraProvider} from "@chakra-ui/react"
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    optimismGoerli,
    base,
    zora,
    goerli,
    polygonMumbai,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID
    ? process.env.NEXT_PUBLIC_PROJECT_ID
    : "NoID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});
export const PushContext = createContext<any|null>(null);
function MyApp({ Component, pageProps }: AppProps) {

  const [userPPP,setUserPPP]=useState<PushAPI|null>(null)
  
  return (

    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider>
        <RecoilRoot>
          <PushContext.Provider value={{userPPP,setUserPPP}}>
          <Component {...pageProps} /></PushContext.Provider>
        </RecoilRoot></ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
