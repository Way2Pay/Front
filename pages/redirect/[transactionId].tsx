"use client";
import { NextPage } from "next";
import RedirectWelome from "../../components/RedirectWelcome/RedirectWelcome";
import { useRouter } from "next/router";




const Redirect: NextPage = () => {
const router = useRouter();
console.log("REDSDHERE",router.query)
  return (
    <>
      <RedirectWelome />
    </>
  );
};

export default Redirect;
