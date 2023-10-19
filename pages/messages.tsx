"use client";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import DeployWelcome from "../components/Deploy/Deploy";
import { PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { useAccount, useWalletClient } from "wagmi";
import { STREAM } from "@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes";
import {
  sendMessage,
  getChatHistory,
  getChatsList,
  getRequestsList,
  acceptRequest,
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
  const [selectedChatDID, setSelectedChatDID] = useState<string | null>(null);

  
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
      console.log(chatList);
      const transformedChats = chatList.map((chat) => ({
        chatId: chat.chatId,
        name: chat.name || "Anonymous", // default to 'Anonymous' if name is null
        avatar: chat.profilePicture,
        did: chat.did,
      }));
      setActiveChats(transformedChats);
      const requests = await getRequestsList(userAlice)
      userAlice.stream.on(STREAM.CHAT, (data: any) => {
        if(selectedChatId)
        fetchChatHistory(selectedChatId);
      });
      setUserPPP(userAlice);
    }
  };

  useEffect(() => {
    initializePush();
  }, [client]);

  let chatHistoryInterval: NodeJS.Timeout | null = null;
  const handleChatSelection = async (chatId: string) => {
    setSelectedChatId(chatId);

    // Assuming the activeChats has the DIDs
    const chatDID = activeChats.find((chat) => chat.chatId === chatId)?.did;
    setSelectedChatDID(chatDID);

    // Clear any existing interval
    if (chatHistoryInterval) {
      clearInterval(chatHistoryInterval);
    }

    

    // Fetch immediately
    await fetchChatHistory(chatId);

    // Then set up an interval to fetch every 10 seconds
  };
const fetchChatHistory = async (chatId:string) => {
      const history = await getChatHistory(userAlice, chatId);
      const formattedHistory = history.map(convertToMessageFormat).reverse();
      setChatHistory(formattedHistory);
      console.log(formattedHistory);
    };
  const convertToMessageFormat = (msg: any): Message => ({
    sender: msg.fromDID === userAliceDID ? "self" : "other", // This is just an example, replace `userAliceDID` with the actual DID of `userAlice`.
    content: msg.messageObj.content,
    timestamp: msg.timestamp,
  });
  const handleSendMessage = async (recipientDID: string, content: string) => {
    try {
      const response = await sendMessage(userAlice, recipientDID, content);
      console.log("Message sent successfully!", response);
      const newMessage: Message = {
        sender: "self",
        content: content,
        timestamp: Date.now(), // Assuming the timestamp is in milliseconds
      };

      setChatHistory((prevHistory) => [...prevHistory, newMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const {address} = useAccount();
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
        onSendMessage={handleSendMessage}
        selectedChatId={selectedChatId}
      />
    </>
  );
};

export default Deploy;
