import { formatAddress } from "../../utils/helpers";
import Identity from "../../pages/identity"
interface UserDataProps {
  data: {
    name?: string;
    desc?: string;
    picture?: string;
    profileVerificationProof?: string;
    blockedUsersList?: string[];
  };
  onEdit: () => void;
  profile?: Profile;
}
type Profile = {
  address: string;
  transactions?: string[];
  deployements?: string[];
  _id: string;
  membership?:boolean;
};

const UserData: React.FC<UserDataProps> = ({ data, onEdit, profile }) => {
  console.log("ASDASD", profile);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative ">
      <div className="bg-white p-10 rounded-xl shadow-lg content-center w-2/6 h-[60vh] space-y-6 mx-5">
        <h2 className="text-3xl font-mono font-bold text-center self-center mb-4 text-gray-800">Account</h2>
        <div className="flex w-full flex-row">
          <h4 className="text-xl self-start font-bold w-1/2 text-center mb-4 text-gray-800">Address :</h4>
          <p className="text-lg text-gray-700 mr-4 w-1/2 text-center leading-relaxed">{formatAddress(profile?.address)}</p>
        </div>
        <div className="flex w-full flex-row">
          <h4 className="text-xl self-start font-bold w-1/2 text-center mb-4 text-gray-800">Account Id :</h4>
          <p className="text-lg text-gray-700 mr-4 w-1/2 text-center leading-relaxed">{formatAddress(profile?._id)}</p>
        </div>
        <div className="flex w-full flex-row">
          <h4 className="text-xl self-start font-bold w-1/2 text-center mb-4 text-gray-800">Membership :</h4>
          <p className="text-lg text-gray-700 mr-4 w-1/2 text-center leading-relaxed">{profile?.membership?"Verified":"Not Verified"}</p>
        </div>
        {profile&&!profile.membership&&(<Identity/>)}

      </div>
      <div className="bg-white p-10 rounded-xl shadow-lg w-2/6 h-[60vh] space-y-6 mx-5">
        <h2 className="text-3xl font-mono font-bold text-center self-center mb-4 text-gray-800">Push Profile</h2>
        <div className="flex w-full flex-row">
          <h4 className="text-xl self-start font-bold w-1/2 text-center mb-4 text-gray-800">Name :</h4>
          <p className="text-lg text-gray-700 mr-4 w-1/2 text-center leading-relaxed">{data.name}</p>
        </div>
        <div className="flex w-full flex-row">
          <h4 className="text-xl self-start font-bold w-1/2 text-center mb-4 text-gray-800">Description :</h4>
          <p className="text-lg text-gray-700 mr-4 w-1/2 text-center leading-relaxed">{data.desc}</p>
        </div>
        <button
          className="absolute top-5 left-5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300 ease-in-out shadow-md"
          onClick={onEdit}
        >
          Edit Push Profile
        </button>
      </div>
    </div>
  );
};

export default UserData;
