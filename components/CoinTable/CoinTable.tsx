import React from "react";
import { Coin } from "../../context/coin";

interface CoinTableProps {
  coins?: Coin[];
  selectedCoin: string | null;
  confirmedCoin: string | null;
  setSelectedCoin: (coin: string | null) => void;
  setSelectedChain: (chain: string | null) => void;
  selectedChain: string | null;
  handleConfirmCoin: () => void;
}

const CoinTable: React.FC<CoinTableProps> = ({
  coins = [], // set the default value as an empty array
  selectedCoin,
  confirmedCoin,
  setSelectedCoin,
  setSelectedChain,
  selectedChain,
  handleConfirmCoin,
}) => {
  // Group coins by chain
  const groupedCoins = coins.reduce<Record<string, Coin[]>>((acc, coin) => {
    if (coin.chain) {
      if (!acc[coin.chain]) acc[coin.chain] = [];
      acc[coin.chain].push(coin);
    }
    return acc;
  }, {});

  return (
    <>
      {Object.entries(groupedCoins).map(([chain, chainCoins]) => (
        <div key={chain}>
          <h2 className="text-xl font-bold mb-4">{chain}</h2>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Coin
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Symbol
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {chainCoins.map((token) => {
                  return (
                    <tr
                      key={token.name}
                      className={`border-b ${
                        selectedCoin === token.name && chain === selectedChain
                          ? "bg-blue-100"
                          : "bg-white"
                      }`}
                      onClick={() => {
                        setSelectedCoin(token.name), setSelectedChain(chain);
                      }}
                    >
                      <td className="px-6 py-4">{token.name}</td>
                      <td className="px-6 py-4">{token.symbol}</td>
                      <td className="px-6 py-4">{token.balance}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <div className="flex justify-center w-full mt-4">
        <button
          className="px-10 w-full max-w-xs border-2 bg-slate-200 rounded-lg p-2 hover:bg-slate-300 "
          onClick={handleConfirmCoin}
          disabled={!selectedCoin}
        >
          Confirm
        </button>
      </div>
    </>
  );
};

export default CoinTable;
