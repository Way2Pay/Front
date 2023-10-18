"use client";
import { Transaction } from "../components/DashBoard/DataTable";
import { useRouter } from "next/router";
import { PushAPI } from "@pushprotocol/restapi";
// import { createSocketConnection, EVENTS } from "@pushprotocol/socket";
import Login from "../components/Login/Login";
import { NextPage } from "next";
import RedirectWelome from "../components/RedirectWelcome/RedirectWelcome";
import { useContext, useEffect, useState } from "react";
import { authState } from "../state/atoms";
import { useRecoilState } from "recoil";
import Navbar from "../components/HomePage/Navbar";
import DataTable from "../components/DashBoard/DataTable";
import TransactionModal from "../components/DashBoard/TransactionModal";
import Coins from "../components/DashBoard/Coins";
import { useWalletClient } from "wagmi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { STREAM } from "@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes";
import { PushContext } from "./_app";
const UserDashBoard: NextPage = () => {
  const router = useRouter();
  const handleSwitchToSellerDashboard = () => {
    router.push("/sellerDashboard"); // Assuming "/sellerDashboard" is the route for the seller dashboard.
  };
  const [auth, setAuth] = useRecoilState(authState);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasFetchedTransactions, setHasFetchedTransactions] = useState(false);
  const [deployedContracts, setDeployedContracts] = useState<Transaction[]>([]);
  const { data: client } = useWalletClient();
  const { userPPP, setUserPPP } = useContext(PushContext);

  useEffect(() => {
    if (!auth.accessToken) {
      const token = localStorage.getItem("accessToken");

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
        `${process.env.NEXT_PUBLIC_API_URL}/transaction/user`,
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
      //   fetchDeployedContracts();

      // Fetch the deployed contracts
    }
  }, [auth.accessToken, router]);

  //   const fetchDeployedContracts = async () => {
  //     try {
  //       console.log("Starting fetchDeployedContracts...");

  //       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deploy`, {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${auth.accessToken}`,
  //         },
  //       });

  //       console.log("Response status:", res.status);

  //       if (res.status === 401) {
  //         console.log("401 Unauthorized - Redirecting to login...");
  //         localStorage.removeItem("accessToken");
  //         setAuth((prevState) => ({
  //           ...prevState,
  //           accessToken: null,
  //         }));
  //         router.push("/login");
  //         return;
  //       } else if (res.status === 200) {
  //         console.log("200 OK - Setting deployed contracts...");
  //         const data = await res.json();
  //         console.log("Received data:", data);
  //         setDeployedContracts(data.contracts); // Assuming the API returns an object with a contracts key
  //       } else {
  //         console.log("Unknown status:", res.status);
  //       }
  //     } catch (error) {
  //       console.error("Error in fetchDeployedContracts:", error);
  //     }
  //   };

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
        <button
          onClick={handleSwitchToSellerDashboard}
          className="bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
        >
          Switch to Seller Dashboard
        </button>
      </div>
      {hasFetchedTransactions && transactions.length > 0 && (
        <div>
          <Coins mode="spent" />
          <DataTable
            transactions={transactions}
            onTransactionClick={handleTransactionClick}
            showDeployedContracts={false} // Set to false for UserDashboard
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

export default UserDashBoard;
