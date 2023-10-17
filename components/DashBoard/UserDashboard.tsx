"use client";
import { Transaction } from "./DataTable";
import { useRouter } from "next/router";
import { PushAPI } from "@pushprotocol/restapi";
// import { createSocketConnection, EVENTS } from "@pushprotocol/socket";
import Login from "../Login/Login";
import { NextPage } from "next";
import RedirectWelome from "../RedirectWelcome/RedirectWelcome";
import { useEffect, useState } from "react";
import { authState } from "../../state/atoms";
import { useRecoilState } from "recoil";
import Navbar from "../HomePage/Navbar";
import DataTable from "../DashBoard/DataTable";
import TransactionModal from "../DashBoard/TransactionModal";
import Coins from "../DashBoard/Coins";
import { useWalletClient } from "wagmi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { STREAM } from "@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes";
const UserDashBoard: NextPage = () => {
  const router = useRouter();

  const [auth, setAuth] = useRecoilState(authState);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasFetchedTransactions, setHasFetchedTransactions] = useState(false);
  const [deployedContracts, setDeployedContracts] = useState<Transaction[]>([]);
  const { data: client } = useWalletClient();
  const [userPPP, setUserPPP] = useState<PushAPI>();

  const initializePush = async () => {
    if (client) {
      let userAlice = await PushAPI.initialize(client, { env: ENV.STAGING });
      userAlice.stream.on(STREAM.NOTIF, (data: any) => {
        console.log("PUSHDATA", data);
      });
      setUserPPP(userAlice);
    }
  };
  useEffect(() => {
    if (!userPPP) initializePush();
  }, [client]);
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

  const fetchDeployedContracts = async () => {
    try {
      console.log("Starting fetchDeployedContracts...");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deploy`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      console.log("Response status:", res.status);

      if (res.status === 401) {
        console.log("401 Unauthorized - Redirecting to login...");
        localStorage.removeItem("accessToken");
        setAuth((prevState) => ({
          ...prevState,
          accessToken: null,
        }));
        router.push("/login");
        return;
      } else if (res.status === 200) {
        console.log("200 OK - Setting deployed contracts...");
        const data = await res.json();
        console.log("Received data:", data);
        setDeployedContracts(data.contracts); // Assuming the API returns an object with a contracts key
      } else {
        console.log("Unknown status:", res.status);
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

  return (
    <>
      <Navbar />
      {hasFetchedTransactions && transactions.length > 0 && (
        <div>
          <Coins />
          <DataTable
            transactions={transactions}
            deployedContracts={deployedContracts}
            onTransactionClick={handleTransactionClick}
          />
        </div>
      )}
      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default UserDashBoard;
