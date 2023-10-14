"use client";
import Login from "./components/Login/Login";
import { NextPage } from "next";
import RedirectWelome from "./components/redirect/RedirectWelcome";
const Redirect: NextPage = () => {
  return (
    <>
      <Login/>
    </>
  );
};

export default Redirect;
