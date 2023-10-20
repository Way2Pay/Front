import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";

const User: React.FC<{
  onNicknameChange: (nickname: string) => void;
  onDescriptionChange: (description: string) => void;
  onSave: () => void;
}> = ({ onNicknameChange, onDescriptionChange, onSave }) => {
  const handleSaveClick = () => {
    onSave();
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        <div className="mb-4">
          <ConnectButton />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Nickname:</label>
          <input
            type="text"
            onChange={(e) => onNicknameChange(e.target.value)}
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Description:</label>
          <textarea
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>
        <div>
          <button
            onClick={handleSaveClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
