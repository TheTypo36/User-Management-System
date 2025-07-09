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
      <div
        className="flex items-center gap-4 min-w-[250px]"
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

      <div className="flex flex-col sm:items-end text-right min-w-[120px]">
        <div className="text-sm text-indigo-600 font-medium">{role}</div>
        <div className="text-xs text-gray-400 whitespace-nowrap">
          {new Date(createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
