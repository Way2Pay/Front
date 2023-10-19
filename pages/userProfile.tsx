import React, { useState, useEffect } from "react";
import User from "../components/UserProfile/User";
import Navbar from "../components/HomePage/Navbar";
import { useRecoilState } from "recoil";
import { authState } from "../state/atoms";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import UserData from "../components/UserProfile/UserData";
const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useRecoilState(authState);
  const { address } = useAccount();
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(false);

  const handleNicknameChange = (newNickname: string) => {
    setNickname(newNickname);
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
  };

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

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Raw fetched data:", data);

        if (data.data && data.data.length > 0) {
          setNickname(data.data[0].nickname);
          setDescription(data.data[0].desc);
          setUserData(data.data[0]);
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        if (error.message.includes("401")) {
          localStorage.removeItem("accessToken");
          setAuth((prevState) => ({
            ...prevState,
            accessToken: null,
          }));
          router.push("/login");
          return;
        } else {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (auth.accessToken) {
      fetchData();
    }
  }, [auth.accessToken, router]);

  const updateUserData = async () => {
    const requestBody = {
      nickname: nickname,
      desc: description,
    };
    console.log(requestBody);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (res.ok) {
      const responseData = await res.json();
      console.log(responseData);
    } else {
      console.error("Failed to update user data:", await res.text());
    }
  };
  console.log("UserData value:", userData);

  return (
    <div>
      <Navbar />
      {loading ? (
        <div>Loading...</div>
      ) : editing || !userData ? (
        <>
          <User
            onNicknameChange={handleNicknameChange}
            onDescriptionChange={handleDescriptionChange}
            onSave={updateUserData}
          />
        </>
      ) : (
        <div>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <UserData data={userData} />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
