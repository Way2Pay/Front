import React from "react";

interface UserDataProps {
  data: {
    nickname: string;
    desc: string;
  };
}

const UserData: React.FC<UserDataProps> = ({ data }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome back, {data.nickname}!
          </h2>
        </div>
        <div className="rounded-md shadow-sm -space-y-px">
          <div className="py-5 border-t border-gray-300">
            <label className="block text-lg font-medium text-gray-700">
              Description
            </label>
            <p className="mt-2 text-base text-gray-500">{data.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;
