import { useNavigate } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import { useAuth, type UserData } from "../contexts/AuthContext";
import axios from "axios";
import { API_URLS } from "../config";
import { toast, ToastContainer } from "react-toastify";

interface userProps {
  user: UserData;
  setChangeui: Dispatch<SetStateAction<number>>;
}

const UserCard = ({ user, setChangeui }: userProps) => {
  console.log("isDeleted", user.isDeleted);
  const { avatar, username, email, createdAt, role, id, isDeleted } = user;
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleClick = () => {
    if (!isDeleted) navigate(`/ProfileById/${id}`);
  };

  const handleEdit = () => {
    if (!isDeleted) navigate(`/user-activities/Update_User/${id}`);
  };

  const handleDelete = (e: any) => {
    e.preventDefault();
    if (!isDeleted) {
      axios
        .delete(API_URLS.DELETE_USER(id), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((Response) => {
          console.log("successfull delete the user", Response);
          toast.success("successfull delete the user");
          setChangeui((prev) => prev + 1);
        });
    }
  };

  const handleDeactivate = () => {
    axios
      .put(
        API_URLS.DEACTIVATE_USER(id),
        { isDeleted: !isDeleted },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("successfull deactivated the user", response);
        toast.success("successfull deactivated the user");
        setChangeui((prev) => prev + 1);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  return (
    <div
      className={`${
        isDeleted ? "bg-gray-200 opacity-60" : "bg-white"
      } text-gray-800 rounded-xl shadow-md p-4 flex flex-wrap items-center justify-between gap-4 hover:shadow-lg transition duration-300 w-full`}
    >
      <ToastContainer position="top-right" autoClose={5000} theme="light" />

      {/* Avatar and Basic Info */}
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
          <div
            className={`text-lg font-semibold ${
              isDeleted ? "line-through text-red-700" : ""
            }`}
          >
            {username}
            {isDeleted && (
              <span className="ml-2 text-xs text-red-600 font-medium">
                [Deactivated]
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">{email}</div>
        </div>
      </div>

      {/* Role and Created Time */}
      <div className="flex flex-col sm:items-end text-right min-w-[120px]">
        <div className="text-sm text-indigo-600 font-medium">{role}</div>
        <div className="text-xs text-gray-400 whitespace-nowrap">
          {new Date(createdAt).toLocaleString()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 items-end min-w-[100px]">
        <button
          className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
          onClick={handleEdit}
          disabled={isDeleted}
        >
          Edit
        </button>
        <button
          className={`text-sm px-3 py-1 ${
            isDeleted
              ? "bg-green-400 text-white hover:bg-green-600"
              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          }  rounded  transition`}
          onClick={handleDeactivate}
        >
          {isDeleted ? "Reactivate" : "Deactivate"}
        </button>
        <button
          className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserCard;
