"use client";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import DeployWelcome from "../components/Deploy/Deploy";
import { PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { useWalletClient } from "wagmi";
import { STREAM } from "@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes";
import { sendMessage } from "../frontend-services/pushServices";
import Chats from "../components/Chats/Chats";
// PushAPI.initialize(signer, {options?});
// signer - pass the signer from your app and set env to 'prod' for mainnet app
// options? - optional, can pass initialization parameters for customization
const Deploy: NextPage = () => {
  const [userPPP, setUserPPP] = useState<PushAPI>();
  const { data: client } = useWalletClient();
  const initializePush = async () => {
    if (client) {
      let userAlice = await PushAPI.initialize(client, { env: ENV.STAGING });
      console.log("USerAlice", userAlice);
      const req = await sendMessage(
        userAlice,
        "0x620E1cf616444d524c81841B85f60F8d3Ea64751"
      );
      console.log("REQYEST", req);
      console.log("HERE", await userAlice.chat.list("REQUESTS"));
      userAlice.stream.on(STREAM.CHAT, (data: any) => {
        console.log(data);
      });
      setUserPPP(userAlice);
    }
  };
  useEffect(() => {
    initializePush();
  }, [client]);
  return (
    <>
      {/* <button>ClickMe</button> */}
      <Chats
        userProfile={{
          name: "De",
          avatar:
            "https://play-lh.googleusercontent.com/aFWiT2lTa9CYBpyPjfgfNHd0r5puwKRGj2rHpdPTNrz2N9LXgN_MbLjePd1OTc0E8Rl1=w240-h480-rw",
          role: "Seller",
          status: "Active",
        }}
        activeConversations={[
          // { name: "Henry Boyd", avatar: "H" },
          { name: "Marta Curtis", avatar: "M", unreadCount: 2 },
          // ... add more
        ]}
        archivedConversations={[
          { name: "Archived User", avatar: "A" },
          // ... add more
        ]}
        messages={[
          { sender: "other", content: "Hey How are you today?", avatar: "A" },
          {
            sender: "self",
            content: "I'm ok what about you?",
            avatar: "A",
            seen: true,
          },
          // ... add more
        ]}
      />
    </>
  );
};

export default Deploy;
