// react page
import {
    SismoConnectButton,
    SismoConnectConfig,
    AuthType,
    ClaimType,
    SismoConnectResponse
  } from "@sismo-core/sismo-connect-react";
  
  const config: SismoConnectConfig = {
    appId: process.env.NEXT_PUBLIC_SISMO_ID?process.env.NEXT_PUBLIC_SISMO_ID:"",
    vault: {
      // For development purposes insert the Data Sources that you want to impersonate
      // Never use this in production
      impersonate: [
        // EVM Data Sources
        "dhadrien.sismo.eth",
        "leo21.sismo.eth",
        "0xA4C94A6091545e40fc9c3E0982AEc8942E282F38",
        "0x1b9424ed517f7700e7368e34a9743295a225d889",
        "0x82fbed074f62386ed43bb816f748e8817bf46ff7",
        "0xc281bd4db5bf94f02a8525dca954db3895685700",
        "vitalik.eth",
        // Github Data Source
        "github:dhadrien",
        // Twitter Data Source
        "twitter:dhadrien_",
        // Telegram Data Source
        "telegram:dhadrien",
      ],
    },
    displayRawResponse: true, // this enables you to get access directly to the 
    // Sismo Connect Response in the vault instead of redirecting back to the app
  };
  
  // button that will redirect tu users faults
  export default function Home() {
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
          groupId: "0xf3bc716d75023570f957495043088fcb",
          claimType: ClaimType.EQ,
          value:1, // impersonated github:dhadrien has 1 contribution, eligible
        },
       
      ]}
      // we ask the user to sign a message
      signature={{message: "I love Sismo!", isSelectableByUser: true}}
      // onResponseBytes calls a 'setResponse' function with the responseBytes returned by the Sismo Vault
      onResponse={ async (response: SismoConnectResponse) => {
        await fetch("/api/verify", {
          method: "POST",
          body: JSON.stringify(response),
        })
      }}
    />
  )}