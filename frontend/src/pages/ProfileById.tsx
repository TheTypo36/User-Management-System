import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URLS } from "../config";
import type { UserData } from "../contexts/AuthContext";

const ProfileById = () => {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<UserData>();
  const id = params.id ?? "";
  const token = localStorage.getItem("token");
  const numericId = parseInt(id);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(API_URLS.GET_PROFILE_BY_ID(numericId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setUser(response.data.existingUser);
      });
  }, [numericId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:w-100 md:w-200 lg:w-250 mt-40     ">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full sm:w-80 md:w-160 lg:w-200 max-w-2xl text-center">
        {user?.isDeleted && <h1>Deactivated</h1>}
        <h1 className="text-xs font-medium text-indigo-500 uppercase tracking-wide mb-4">
          {user?.role}
        </h1>
        <img
          src={user?.avatar ? user?.avatar : "./avatar.webp"}
          alt="User Avatar"
          className="w-100 h-100 rounded-full mx-auto border border-gray-300 object-cover mb-6"
        />
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          {user?.username}
        </h1>
        <h2 className="text-sm text-gray-500">Email: {user?.email}</h2>
        <div>
          <div>
            createdAt: {new Date(user?.createdAt || "").toLocaleString()}
          </div>
        </div>
        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          onClick={() => navigate(`/user-activities/Update_User/${numericId}`)}
        >
          edit profile
        </button>
      </div>
    </div>
  );
};

export default ProfileById;
