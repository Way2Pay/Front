import React, { useState } from "react";
import { Chain} from "../../context/chain";

import { desiredTokensByChain } from "../../utils/utils";
interface TableProps {
  chains?: Chain[];
  selectedChain: string | null;
  confirmedChain: string | null;
  setSelectedChain: (chain: string | null) => void;
  handleConfirmChain: () => void;
}

const ChainTable: React.FC<TableProps> = ({
  selectedChain,
  confirmedChain,
  setSelectedChain,
  handleConfirmChain,
}) => {
  const chains = Object.keys(desiredTokensByChain)
  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Chain
              </th>
              <th scope="col" className="px-6 py-3">
                Gas Price
              </th>
            </tr>
          </thead>
          <tbody>
            {chains.map((chain) => (
              <tr
                key={chain}
                className={`border-b ${
                  selectedChain === chain ? "bg-blue-100" : "bg-white"
                }`}
                onClick={() => setSelectedChain(chain)}
              >
                <td className="px-6 py-4">{chain}</td>
                <td className="px-6 py-4">{100+" wei"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center w-full mt-4">
        <button
          className="px-10 w-full max-w-xs border-2 bg-slate-200 rounded-lg p-2 hover:bg-slate-300 "
          onClick={handleConfirmChain}
          disabled={!selectedChain}
        >
          Confirm
        </button>
      </div>
    </>
  );
};

export default ChainTable;
