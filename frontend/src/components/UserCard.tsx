import type { UserData } from "../contexts/AuthContext";

interface userProps {
  user: UserData;
}
const UserCard = (props: userProps) => {
  const { avatar, username, email, createdAt, role } = props.user;
  return (
    <div className="flex flex-row w-full justify-between items-center h-20 bg-gray-400 p-2 m-2 text-white">
      <div>
        <div>
          {<img src={avatar ? avatar : "./avatar.webp"} width="50px" />}
        </div>
      </div>
      <div className="h-full flex flex-col">
        <div>{username}</div>
        <div>{email}</div>
      </div>
      <div>{role}</div>
      <div>createdAt: {createdAt.toLocaleString()}</div>
    </div>
  );
};

export default UserCard;
