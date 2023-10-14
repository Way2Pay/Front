import React, { useEffect, useState } from "react";
import { Coin, coins as defaultCoins } from "../../context/coin";
import { useAccount } from "wagmi";
interface CoinTableProps {
  coins?: Coin[];
  selectedCoin: string | null;
  confirmedCoin: string | null; // Add this line
  setSelectedCoin: (coin: string | null) => void;
  handleConfirmCoin: () => void;
}

const CoinTable: React.FC<CoinTableProps> = ({
  coins = defaultCoins,
  selectedCoin,
  confirmedCoin,
  setSelectedCoin,
  handleConfirmCoin,
}) => {
  const [fetchedCoins, setFetchedCoins] = useState<Coin[]>(coins);

  useEffect(() => {
    const fetchData = async () => {
      const userAddress = "..."; // Provide the user's address here
      const currentChainId = 1; // Provide the current chain's ID here (or fetch it if it's dynamic)

      try {
        const response = await fetch("/api/useCoins", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: userAddress,
            chainId: currentChainId,
          }),
        });

        const data = await response.json();
        // Assuming the API returns an array of coins, update the state
        setFetchedCoins(data);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
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
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr
                key={coin.name}
                className={`border-b ${
                  selectedCoin === coin.name ? "bg-blue-100" : "bg-white"
                }`}
                onClick={() => setSelectedCoin(coin.name)}
              >
                <td className="px-6 py-4">{coin.name}</td>
                <td className="px-6 py-4">{coin.symbol}</td>
                <td className="px-6 py-4">{coin.price}</td>
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

export default CoinTable;
