import React, { useState } from "react";
import QRCode from "qrcode.react";
import { Deployements } from "./DataTable";

type ContractModalProps = {
  contract: Deployements;
  onClose: () => void;
};

const ContractModal: React.FC<ContractModalProps> = ({ contract, onClose }) => {
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0); // State to hold amount
  const [trxID, settrxID] = useState<string | null>(null);

  const handleGenerateQR = async () => {
    const data = {
      address: contract.owner,
      amount: amount,
      chainId: contract.chainId,
      contractAddress: contract.contract,
    };
    if (amount) {
      try {
        const response = await fetch("/api/transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        console.log(responseData.id);

        if (responseData) {
          settrxID(responseData.id); // Set the trxID
          console.log(responseData.id);
          // Update the QR value with the new trxID
          const qrValue = `https://front-git-test-way2pay.vercel.app/redirect/${trxID}`;
          setQrValue(qrValue);
        }
      } catch (error) {
        console.error("There was an error with the transaction:", error);
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-1/2 max-w-lg">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl mb-4 font-semibold">Contract Details</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 transition duration-150"
          >
            ×
          </button>
        </div>
        <div className="mt-4">
          <p className="mb-2">
            <strong className="text-gray-700">Chain ID:</strong>{" "}
            {contract.chainId}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Coin:</strong> {contract.coin}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Contract:</strong>{" "}
            {contract.contract}
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Owner:</strong> {contract.owner}
          </p>
        </div>

        <div className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter Amount for QR:
            </label>
            <input
              type="number"
              id="amount"
              onChange={(e) => setAmount(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 w-64"
            />
          </div>

          <button
            onClick={handleGenerateQR}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-6"
          >
            Generate QR
          </button>

          {qrValue && (
            <div className="mt-6 flex flex-col items-center">
              <QRCode value={qrValue} size={256} />
              <p className="mt-4 text-gray-600">
                Scan the above QR code to proceed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractModal;
