import { NextPage } from "next";
import React from "react";

import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const RedirectWelome: NextPage = () => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnecting, isDisconnected } = useAccount();

  return (
    <div>
      <section className="relative flex items-center w-full bg-white">
        <div className="relative items-center w-full px-5 py-24 mx-auto md:px-12 lg:px-16 max-w-7xl">
          <div className="relative flex-col items-start m-auto align-middle">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-24">
              <div className="relative items-center gap-12 m-auto lg:inline-flex md:order-first">
                <div className="max-w-xl text-center lg:text-left">
                  <div>
                    <p className="max-w-xl mt-4  font-thin tracking-tight text-gray-600 text-2xl">
                      Connect Your Wallet To Get Started..
                    </p>
                    <p className="text-2xl font-black tracking-tight text-black sm:text-4xl lg:text-8xl ">
                      Let&apos;s Set You Up!
                    </p>
                  </div>

                  <div className="flex items-center space-x-6 mt-10 w-full ">
                    {address && !isDisconnected ? (
                      <ConnectButton />
                    ) : (
                      <button
                        onClick={openConnectModal}
                        className="px-10 w-full max-w-xs border-2 bg-slate-200 rounded-lg p-2  "
                      >
                        Connect Wallet
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="order-first block w-full mt-12 aspect-square lg:mt-0">
                <img
                  className="object-cover object-center w-full mx-auto bg-gray-300 lg:ml-auto "
                  alt="hero"
                  src="../images/placeholders/square2.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RedirectWelome;
