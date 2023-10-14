import { NextPage } from "next";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { slideRight, slideUp } from "../../../context/motionpresets";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient} from "wagmi";
import { useConnect } from "wagmi";
import { disconnect , getWalletClient} from "@wagmi/core";
import {tokenAddresses, routerAddress} from "../../../context/chainTokenaddresses";
import {MetaMaskConnector} from "wagmi/connectors/metaMask";
import {ContractFactory} from 'ethers';
import "../../../destabi.json";
import { goerli } from "viem/chains";
// import ChainTable from "../../../components/chaintable";
import CoinTable from "../../../components/cointable";

// import { useState } from 'react';

function ChainTable({ onChainSelect }: { onChainSelect: (chain: string) => void }) {
    const chains: string[] = ['Ethereum', 'Binance Smart Chain', 'Polygon', 'Solana']; // Add more chains as needed

    return (
        <div>
            <h2>Select a Chain:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Chain</th>
                    </tr>
                </thead>
                <tbody>
                    {chains.map((chain) => (
                        <tr key={chain}>
                            <td>
                                <button onClick={() => onChainSelect(chain)}>{chain}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TokenTable({ selectedChain, onTokenSelect }: { selectedChain: string; onTokenSelect: (token: string) => void }) {
    // Define tokens for each chain
    const tokens: Record<string, string[]> = {
        Ethereum: ['Token1', 'Token2', 'Token3'],
        'Binance Smart Chain': ['BEP-20 Token1', 'BEP-20 Token2'],
        Polygon: ['Matic Token1', 'Matic Token2'],
        Solana: ['SPL Token1', 'SPL Token2'],
    };

    return (
        <div>
            <h2>Select a Token for {selectedChain}:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Token</th>
                    </tr>
                </thead>
                <tbody>
                    {tokens[selectedChain].map((token) => (
                        <tr key={token}>
                            <td>
                                <button onClick={() => onTokenSelect(token)}>{token}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function DeployWelcome() {
    const [selectedChain, setSelectedChain] = useState<string>('');
    const [selectedToken, setSelectedToken] = useState<string>('');
    // const { address, isConnecting, isDisconnected } = useAccount();
    const {openConnectModal} = useConnectModal();
    const [chainId, setChainId] = useState(5);
    const {address, isConnecting, isDisconnected} = useAccount();
    const { data: walletClient, isError, isLoading } = useWalletClient({chainId:chainId});
    const { connect } = useConnect({

        connector: new MetaMaskConnector(),
        
        chainId: 5,
        });
    const handleChainSelect = (chain: string) => {
        setSelectedChain(chain);
    };

    const handleTokenSelect = (token: string) => {
        setSelectedToken(token);
    };

    async function deployContract (){
        let abiData = require('../../../destabi.json');
        const client = await getWalletClient({chainId:5});
        console.log(client);
        const factory = new ContractFactory(abiData["abi"], abiData["bytecode"]);
        const a = await client?.deployContract({abi: abiData["abi"],account: address,  bytecode: abiData["bytecode"] as `0x${string}`, args:["0x7ea6eA49B0b0Ae9c5db7907d139D9Cd3439862a1","0xE592427A0AEce92De3Edee1F18E0157C05861564"]});
        console.log(a);
        
    
    }
    

    return (
        <div>
            {!selectedChain ? (
                <ChainTable onChainSelect={handleChainSelect} />
            ) : !selectedToken ? (
                <TokenTable selectedChain={selectedChain} onTokenSelect={handleTokenSelect} />
            ) : (
                <div>
                    <h2>Selected Chain: {selectedChain}</h2>
                    <h2>Selected Token: {selectedToken}</h2>
                    <button onClick={()=>{connect}}> Connect Wallet</button>
                    <button onClick={deployContract}> Deploy</button>
                </div>
            )}
        </div>
    );
}

export default DeployWelcome;
