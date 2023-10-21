import React, { useState } from "react";
import QRCode from "qrcode.react";

const QR: React.FC = () => {
  const [trxID, settrxID] = useState<string | null>(null);

  const handlePurchase = async () => {
    const data = {
      address: "0x1b3A00A796940C2a23a05c867b88bb5832c19435",
      amount: 30,
      chainId: 5,
      contractAddress: "0x46F9BF1Ec252e6f7FFcA7650faDb1Ea2F29E0DC8",
    };

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
        settrxID(responseData.id);
      }
    } catch (error) {
      console.error("There was an error with the transaction:", error);
    }
  };

  const qrValue = `https://front-git-test-way2pay.vercel.app/redirect/${trxID}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-xl flex flex-col items-center">
        <button
          onClick={handlePurchase}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-6"
        >
          Generate a QR code
        </button>

        {trxID && (
          <div className="mt-6 flex flex-col items-center">
            <QRCode value={qrValue} size={256} />
            <p className="mt-4 text-gray-600">
              Scan the above QR code to proceed
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QR;
