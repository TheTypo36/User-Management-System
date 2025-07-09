import type { UserData } from "../contexts/AuthContext";

interface userProps {
  user: UserData;
}

const UserCard = (props: userProps) => {
  const { avatar, username, email, createdAt, role } = props.user;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition duration-300">
      <div className="flex-shrink-0">
        <img
          src={avatar ? avatar : "./avatar.webp"}
          alt="User Avatar"
          className="w-14 h-14 rounded-full object-cover border border-gray-300"
        />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="text-lg font-semibold text-gray-800">{username}</div>
        <div className="text-sm text-gray-500">{email}</div>
      </div>
      <div className="text-sm text-indigo-600 font-medium">{role}</div>
      <div className="text-xs text-gray-400 ml-4 whitespace-nowrap">
        {new Date(createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default UserCard;
