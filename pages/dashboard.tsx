"use client";
import Login from "../components/Login/Login";
import { NextPage } from "next";
import RedirectWelome from "../components/RedirectWelcome/RedirectWelcome";
import { useEffect } from "react";
import { authState } from "../state/atoms";
import { useRecoilState } from "recoil";
const Redirect: NextPage = () => {
  const [auth, setAuth] = useRecoilState(authState);

  useEffect(() => {
    if (!auth.accessToken)
      setAuth({
        ...auth,
        accessToken: localStorage.getItem("accessToken"),
      });
  }, []);
  const abc = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    });
    if(res.status===200)
    console.log(await res.json())
    else
    console.log(res)
  };
  return (
    <>
      <button onClick={()=>{abc()}}>Click Me</button>
    </>
  );
};

export default Redirect;
