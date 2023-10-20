import React, { useState, useEffect, useContext } from "react";
import User from "../components/UserProfile/User";
import Navbar from "../components/HomePage/Navbar";
import { useRecoilState } from "recoil";
import { authState } from "../state/atoms";
import { useAccount, useWalletClient } from "wagmi";
import { useRouter } from "next/router";
import UserData from "../components/UserProfile/UserData";
import { PushContext } from "./_app";
import { PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { getUserInfo, updateUserInfo } from "../frontend-services/pushServices";
const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useRecoilState(authState);
  const { address } = useAccount();
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(false);
  const { userPPP,setUserPPP } = useContext(PushContext);
  const {data:client} = useWalletClient();
  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname);
  };
  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
  };

  const initializePush = async () => {
    if (client) {
      console.log("REACHED IN HERE")
      let userAlice = await PushAPI.initialize(client, { env: ENV.STAGING });
      let data = await getUserInfo(userAlice)
        setNickname( data?.name?data.name:"");
        setDescription(data?.desc?data.desc:"");
        setUserData(data);
      setUserPPP(userAlice);
      setLoading(false)
    }
  };
  useEffect(()=>{
    console.log("HERE",userPPP)
    if(!userPPP)
    {
      if(client)
      initializePush();
    }

  },[client])
  useEffect(() => {
    setLoading(true);
    if (!auth.accessToken) {
      const token = localStorage.getItem("accessToken");
      if (token) {
       
        setAuth({
          ...auth,
          accessToken: token,
        });
      } else {
        router.push("/login");
        return;
      }
    }
    

    if (auth.accessToken) {
      //fetchData();
    }
  }, [auth.accessToken, router]);

  const updateUserData = async () => {
    const requestBody = {
      nickname: nickname,
      desc: description,
    };
   let data= updateUserInfo(userPPP,undefined,nickname,description)

      setEditing(false); // Hide the editing form
       // Reload the data after successfully updating
  };
  console.log("UserData value:", userData);

  return (
    <div>
      <Navbar />
      {loading ? (
        <div>Loading...</div>
      ) : editing || !userData ? (
        <User
          onNicknameChange={handleNicknameChange}
          onDescriptionChange={handleDescriptionChange}
          onSave={updateUserData}
        />
      ) : (
        <UserData data={userData} onEdit={() => setEditing(true)} />
      )}
    </div>
  );
};

export default UserProfile;
