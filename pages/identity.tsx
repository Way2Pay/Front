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
    : "", // this enables you to get access directly to the
  // Sismo Connect Response in the vault instead of redirecting back to the app
};

// button that will redirect tu users faults
export default function Home() {
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
      config={config}
      // Auths = Data Source Ownership Requests
      auths={[
        // Anonymous identifier of the vault for this app
        // vaultId = hash(vaultSecret, appId).
        // full docs: https://docs.sismo.io/sismo-docs/build-with-sismo-connect/technical-documentation/vault-and-proof-identifiers
        // user is required to prove ownership of their vaultId for this appId

        // user is required to prove ownership of an EVM account from their vault
        { authType: AuthType.EVM_ACCOUNT },
        { authType: AuthType.VAULT },
        // user is required to prove ownership of 0xa4c94a6091545e40fc9c3e0982aec8942e282f38
      ]}
      // Claims = prove groump membership of a Data Source in a specific Data Group.
      // Data Groups = [{[dataSource1]: value1}, {[dataSource1]: value1}, .. {[dataSource]: value}]
      // When doing so Data Source is not shared to the app.
      claims={[
        {
          // claim on Sismo Hub GitHub Contributors Data Group membership: https://factory.sismo.io/groups-explorer?search=0xda1c3726426d5639f4c6352c2c976b87
          // Data Group members          = contributors to sismo-core/sismo-hub
          // value for each group member = number of contributions
          // request user to prove membership in the group
          groupId: "0x52199513be6e1725c232017d0fce5f4f",
          claimType: ClaimType.EQ,
          value: 1, // impersonated github:dhadrien has 1 contribution, eligible0x52199513be6e1725c232017d0fce5f4f
        },
      ]}
      // we ask the user to sign a message
      signature={{ message: "Way2Pay Member" }}
      // onResponseBytes calls a 'setResponse' function with the responseBytes returned by the Sismo Vault
      onResponse={async (response: SismoConnectResponse) => {
        await fetch("/api/sismo/receiver", {
          method: "POST",
          body: JSON.stringify({data:response,userAddress:address}),
        });
      }}
    />
  );
}
