interface UserDataProps {
  data: {
    name?: string;
    desc?: string;
    picture?:string;
    profileVerificationProof?: string;
    blockedUsersList?: string[];

  };
  onEdit: () => void;
}

const UserData: React.FC<UserDataProps> = ({ data, onEdit }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative ">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-7xl space-y-6 ">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Welcome back, {data.name}!
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">{data.desc}</p>
        <button
          className="absolute top-5 left-5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300 ease-in-out shadow-md"
          onClick={onEdit}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default UserData;
