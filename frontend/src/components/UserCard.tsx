import { useNavigate } from "react-router-dom";
import { useAuth, type UserData } from "../contexts/AuthContext";
import axios from "axios";
import { API_URLS } from "../config";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface userProps {
  user: UserData;
}

const UserCard = (props: userProps) => {
  const { avatar, username, email, createdAt, role, id, isDeleted } =
    props.user;
  const navigate = useNavigate();
  const { token } = useAuth();
  const handleClick = () => {
    navigate(`/ProfileById/${id}`);
  };
  const handleEdit = () => {
    navigate(`/user-activities/Update_User/${id}`);
  };
  const handleDelete = (e: any) => {
    e.preventDefault();
    axios.delete(API_URLS.DELETE_USER(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  };
  const handleDeactivate = () => {
    axios
      .put(
        API_URLS.DEACTIVATE_USER(id),
        {
          isDeleted: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response);
        toast.success("success full deactivated");
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  return (
    <div
      className={`${
        isDeleted ? "bg-red-300" : "text-white"
      } rounded-xl shadow-md p-4 flex flex-wrap items-center justify-between gap-4 hover:shadow-lg transition duration-300 w-full`}
    >
      {/* Avatar and basic info */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
        <button
          className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
          onClick={handleEdit}
        >
          Edit
        </button>
        <button
          className="text-sm px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
          onClick={handleDeactivate}
        >
          Deactivate
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
