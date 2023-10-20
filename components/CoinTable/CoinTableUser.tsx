import React from "react";

interface Coin {
  name: string;
  symbol: string;
  address: string|`0x${string}`;

}

interface CoinTableProps {
  coins: Coin[];
  selectedCoin: string | null;
  confirmedCoin: string | null;
  setSelectedCoin: (coin: string | null) => void;
  handleConfirmCoin: () => void;
}

const CoinTableUser: React.FC<CoinTableProps> = ({
  coins,
  selectedCoin,
  confirmedCoin,
  setSelectedCoin,
  handleConfirmCoin,
}) => {
  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Symbol
              </th>
            </tr>
          </thead>
          <tbody>
            {coins.map((token) => (
              <tr
                key={token.name}
                className={`border-b ${
                  selectedCoin === token.name ? "bg-blue-100" : "bg-white"
                }`}
                onClick={() => setSelectedCoin(token.address)}
              >
                <td className="px-6 py-4">{token.symbol}</td>
                <td className="px-6 py-4">{token.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

export default CoinTableUser;
