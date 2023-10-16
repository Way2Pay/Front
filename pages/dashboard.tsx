"use client";
import { Transaction } from "../components/DashBoard/DataTable";
import { useRouter } from "next/router";
import Login from "../components/Login/Login";
import { NextPage } from "next";
import RedirectWelome from "../components/RedirectWelcome/RedirectWelcome";
import { useEffect, useState } from "react";
import { authState } from "../state/atoms";
import { useRecoilState } from "recoil";
import Navbar from "../components/HomePage/Navbar";
import DataTable from "../components/DashBoard/DataTable";
import TransactionModal from "../components/DashBoard/TransactionModal";

const DashBoard: NextPage = () => {
  const router = useRouter();

  const [auth, setAuth] = useRecoilState(authState);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasFetchedTransactions, setHasFetchedTransactions] = useState(false);

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
      if (res.status === 200) {
        setTransactions((await res.json()).transactions);
        setHasFetchedTransactions(true);
      } else {
        console.log(res);
      }
    };

    if (auth.accessToken) {
      fetchTransactions();
    }
  }, [auth.accessToken, router]);

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
        <DataTable
          transactions={transactions}
          onTransactionClick={handleTransactionClick}
        />
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

export default DashBoard;
