import { useNavigate } from "react-router-dom";
import type { UserData } from "../contexts/AuthContext";

interface userProps {
  user: UserData;
}

const UserCard = (props: userProps) => {
  const { avatar, username, email, createdAt, role, id } = props.user;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/ProfileById/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap items-center justify-between gap-4 hover:shadow-lg transition duration-300 w-full">
      {/* Avatar and basic info */}
      <div
        className="flex items-center gap-4 min-w-[250px] cursor-pointer"
        onClick={handleClick}
      >
        <img
          src={avatar ? avatar : "./avatar.webp"}
          alt="User Avatar"
          className="w-14 h-14 rounded-full object-cover border border-gray-300"
        />
        <div className="flex flex-col">
          <div className="text-lg font-semibold text-gray-800">{username}</div>
          <div className="text-sm text-gray-500">{email}</div>
        </div>
      </div>

      {/* Role and creation time */}
      <div className="flex flex-col sm:items-end text-right min-w-[120px]">
        <div className="text-sm text-indigo-600 font-medium">{role}</div>
        <div className="text-xs text-gray-400 whitespace-nowrap">
          {new Date(createdAt).toLocaleString()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 items-end min-w-[100px]">
        <button className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
          Edit
        </button>
        <button className="text-sm px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition">
          Deactivate
        </button>
        <button className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
