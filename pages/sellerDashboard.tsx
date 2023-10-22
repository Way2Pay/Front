"use client";
import { Transaction, Deployements } from "../components/DashBoard/DataTable";
import { useRouter } from "next/router";
// import { createSocketConnection, EVENTS } from "@pushprotocol/socket";
import { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { authState } from "../state/atoms";
import { useRecoilState } from "recoil";
import Navbar from "../components/HomePage/Navbar";
import DataTable from "../components/DashBoard/DataTable";
import TransactionModal from "../components/DashBoard/TransactionModal";
import ContractModal from "../components/DashBoard/ContractModal";
import Coins from "../components/DashBoard/Coins";
import { useWalletClient } from "wagmi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { STREAM } from "@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes";
import { PushContext } from "./_app";
const SellerDashBoard: NextPage = () => {
  const router = useRouter();
  const [selectedContract, setSelectedContract] = useState<Deployements | null>(
    null
  );

  const [auth, setAuth] = useRecoilState(authState);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasFetchedTransactions, setHasFetchedTransactions] = useState(false);
  const [deployedContracts, setDeployedContracts] = useState<Deployements[]>(
    []
  );
  const [depFetch,setDepFetch]=useState(false);
  const { data: client } = useWalletClient();
  const { userPPP, setUserPPP } = useContext(PushContext);
  const handleSwitchToSellerDashboard = () => {
    router.push("/userDashboard"); // Assuming "/sellerDashboard" is the route for the seller dashboard.
  };
  useEffect(() => {
    if (!auth.accessToken) {
      const token = localStorage.getItem("accessToken");
      console.log("TOKEN", auth.accessToken);
      if (token) {
        setAuth({
          ...auth,
          accessToken: token,
        });
      } else {
        // Redirect to login if no token is found
        router.push("/login");
        return;
      }
    }

    const fetchTransactions = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      // Check if the status is Unauthorized
      if (res.status === 401) {
        // Clear the token from local storage and auth state
        localStorage.removeItem("accessToken");
        setAuth((prevState) => ({
          ...prevState,
          accessToken: null,
        }));
        setUserPPP(null);
        // Redirect to login
        router.push("/login");
        return;
      } else if (res.status === 200) {
        setTransactions((await res.json()).transactions);
        setHasFetchedTransactions(true);
      } else {
      }
    };

    if (auth.accessToken) {
      fetchTransactions();
      fetchDeployedContracts();

      // Fetch the deployed contracts
    }
  }, [auth.accessToken, router]);

  const handleContractClick = (contract: Deployements) => {
    setSelectedContract(contract);
  };

  const handleCloseContractModal = () => {
    setSelectedContract(null);
  };
  const fetchDeployedContracts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deploy`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        setAuth((prevState) => ({
          ...prevState,
          accessToken: null,
        }));
        router.push("/login");
        return;
      } else if (res.status === 200) {
        const data = await res.json();
        console.log("GGEE", data);
        setDepFetch(true)
        setDeployedContracts(data.deployements); // Assuming the API returns an object with a contracts key
      } else {
      }
    } catch (error) {
      console.error("Error in fetchDeployedContracts:", error);
    }
  };

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
  };
  const handleNavigateToMessages = () => {
    router.push("/messages");
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center my-4">
        <div className="grid grid-cols-1 gap-4 items-center">
          <button
            onClick={handleSwitchToSellerDashboard}
            className="bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
          >
            Switch to User Dashboard
          </button>
        </div>
      </div>

      {selectedContract && (
        <ContractModal
          contract={selectedContract}
          onClose={handleCloseContractModal}
        />
      )}

      {(deployedContracts?.length>0||transactions.length>0) && (
        <div>
          <Coins mode="earned" />
          <DataTable
            transactions={transactions}
            deployedContracts={deployedContracts}
            onTransactionClick={handleTransactionClick}
            onContractClick={handleContractClick}
            showDeployedContracts={true} // Set to false for UserDashboard
          />
        </div>
      )}
      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={handleCloseModal}
        />
      )}
      <div className="fixed bottom-4 right-4 flex space-x-4">
        <img
          src="chat.png" // Replace with the actual path to your PNG image
          alt="Navigate to Messages" // Add a descriptive alt text for accessibility
          onClick={handleNavigateToMessages}
          className="cursor-pointer hover:opacity-80 transition duration-200 h-8" // Added some styling for a hover effect
        />

        <img
          src="notification.png" // Replace with the actual path to your PNG image
          alt="Navigate to Messages" // Add a descriptive alt text for accessibility
          onClick={handleNavigateToMessages}
          className="cursor-pointer hover:opacity-80 transition duration-200 h-8" // Added some styling for a hover effect
        />
      </div>
    </>
  );
};

export default SellerDashBoard;
