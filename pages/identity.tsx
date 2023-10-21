// react page
import {
  SismoConnectButton,
  SismoConnectConfig,
  AuthType,
  ClaimType,
  SismoConnectResponse,
} from "@sismo-core/sismo-connect-react";
import { useAccount } from "wagmi";
import { useRecoilState } from "recoil";
import { authState } from "../state/atoms";
import { useEffect } from "react";

const config: SismoConnectConfig = {
  appId: process.env.NEXT_PUBLIC_SISMO_ID
    ? process.env.NEXT_PUBLIC_SISMO_ID
    : "",
};

// button that will redirect tu users faults
 const Home=()=> {
    const {address } = useAccount();
  const [auth, setAuth] = useRecoilState(authState);
  useEffect(() => {
    if (!auth.accessToken) {
      const token = localStorage.getItem("accessToken");
      if (token) setAuth({ ...auth, accessToken: token });
    }
  }, []);
  return (
    <SismoConnectButton
      text={"Get Membership"}
      config={config}
      // Auths = Data Source Ownership Requests
      auths={[
        
        { authType: AuthType.EVM_ACCOUNT },
        { authType: AuthType.VAULT },
      ]}
      claims={[
        {
          groupId: "0x52199513be6e1725c232017d0fce5f4f",
          claimType: ClaimType.EQ,
          value: 1, 
        },
      ]}
      signature={{ message: "Way2Pay Member" }}
      onResponse={async (response: SismoConnectResponse) => {
        await fetch("/api/sismo/receiver", {
          method: "POST",
          headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({data:response,userAddress:address}),
        });
      }}
    />
  );
}
export default Home
