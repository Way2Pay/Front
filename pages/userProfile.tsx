import React, { useState, useEffect, useContext } from "react";
import User from "../components/UserProfile/User";
import Navbar from "../components/HomePage/Navbar";
import { useRecoilState } from "recoil";
import { authState } from "../state/atoms";
import {getUserProfile} from "../frontend-services/profileServices"
import { useWalletClient } from "wagmi";
import { useRouter } from "next/router";
import UserData from "../components/UserProfile/UserData";
import { PushContext } from "./_app";
import { PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { getUserInfo, updateUserInfo } from "../frontend-services/pushServices";


type Profile={
  address:string;
  transactions?:string[];
  deployements?:string[];
  _id:string;
  }

  
const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useRecoilState(authState);
  const [profile,setProfile]=useState<Profile|undefined>();
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(false);
  const { userPPP, setUserPPP } = useContext(PushContext);
  const { data: client } = useWalletClient();
  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname);
  };
  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
  };
  const fetchUserData = async (userObject: PushAPI) => {
    let data = await getUserInfo(userObject);
    setUserData(data);
    setNickname(data?.name ? data.name : "");
    setDescription(data?.desc ? data.desc : "");
  };
  const initializePush = async () => {
    if (client) {
      console.log("REACHED IN HERE");
      let userAlice = await PushAPI.initialize(client, { env: ENV.STAGING });
      fetchUserData(userAlice);
      setUserPPP(userAlice);
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("HERE", userPPP);
    if (!userPPP) {
      if (client) initializePush();
    }
  }, [client]);
  useEffect(() => {
   setLoading(true);
    const token=auth.accessToken?auth.accessToken:localStorage.getItem("accessToken");
      if (token) {
        if(!auth.accessToken)
        setAuth({
          ...auth,
          accessToken: token,
        });
        fetchData(token);
      } else {
        router.push("/login");
        return;
      }
  }, [auth.accessToken, router]);

  const fetchData=async (token:string)=>{

    if(!process.env.NEXT_PUBLIC_API_URL)
    return;
    const result = await getUserProfile(process.env.NEXT_PUBLIC_API_URL+"/profile",token)
    console.log("HE23123",result)
    setProfile(result.data)
  }
  const updateUserData = async () => {
    const requestBody = {
      nickname: nickname,
      desc: description,
    };
    let data = await updateUserInfo(userPPP, undefined, nickname, description);
    fetchUserData(userPPP);
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
        <UserData data={userData} profile={profile} onEdit={() => setEditing(true)} />
      )}
    </div>
  );
};

export default UserProfile;
