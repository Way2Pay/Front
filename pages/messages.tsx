"use client";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import DeployWelcome from "../components/Deploy/Deploy";
import { PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { useWalletClient } from "wagmi";
import { STREAM } from "@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes";
import {
  sendMessage,
  getChatHistory,
  getChatsList,
} from "../frontend-services/pushServices";
import Chats from "../components/Chats/Chats";
interface Message {
  sender: "self" | "other";
  content: string;
  timestamp: number;
  // Add any other fields you might need
}
const Deploy: NextPage = () => {
  const [messageContent, setMessageContent] = useState("");

  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [userAlice, setUserAlice] = useState<any | null>(null);

  const [userPPP, setUserPPP] = useState<PushAPI>();
  const [chatHistory, setChatHistory] = useState<any[]>([]); // <-- New state for chat history
  const { data: client } = useWalletClient();

  const initializePush = async () => {
    if (client) {
      let userAlice = await PushAPI.initialize(client, { env: ENV.STAGING });
      setUserAlice(userAlice);

      const chatList = await getChatsList(userAlice);
      const transformedChats = chatList.map((chat) => ({
        chatId: chat.chatId,
        name: chat.name || "Anonymous", // default to 'Anonymous' if name is null
        avatar: chat.profilePicture,
      }));
      setActiveChats(transformedChats);

      userAlice.stream.on(STREAM.CHAT, (data: any) => {
        console.log(data);
      });
      setUserPPP(userAlice);
    }
  };

  useEffect(() => {
    initializePush();
  }, [client]);

  const handleChatSelection = async (chatId: string) => {
    setSelectedChatId(chatId);

    const history = await getChatHistory(userAlice, chatId);
    const formattedHistory = history.map(convertToMessageFormat);

    setChatHistory(formattedHistory);
  };
  const convertToMessageFormat = (msg: any): Message => ({
    sender: msg.fromDID === userAliceDID ? "self" : "other", // This is just an example, replace `userAliceDID` with the actual DID of `userAlice`.
    content: msg.messageObj.content,
    timestamp: msg.timestamp,
  });

  const address = "0x0DE9fF5790C73c4b2D5CD9fA1D209C472ad44270";
  const userAliceDID = `eip155:${address}`;

  // Assuming the chatHistory is an array of messages with sender, content, avatar, etc.
  // If not, you might need to map and transform it into the required structure.

  return (
    <>
      <Chats
        userProfile={{
          name: "De",
          avatar:
            "https://play-lh.googleusercontent.com/aFWiT2lTa9CYBpyPjfgfNHd0r5puwKRGj2rHpdPTNrz2N9LXgN_MbLjePd1OTc0E8Rl1=w240-h480-rw",
          role: "Seller",
          status: "Active",
        }}
        activeConversations={activeChats}
        archivedConversations={[]}
        messages={chatHistory} // <-- Pass the chat history here
        onChatSelect={handleChatSelection}
      />
    </>
  );
};

export default Deploy;
