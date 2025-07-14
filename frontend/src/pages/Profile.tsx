import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { UserData } from "../contexts/AuthContext";
import AvatarUpload from "../components/AvatarUpload";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../config";
import { ToastContainer } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();

  const [updatedUser, setUpdateUser] = useState<UserData>();
  const { isLoggedIn } = useAuth();
  const id = Number(localStorage.getItem("id"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signIn");
    }
    axios
      .get(API_URLS.GET_PROFILE_BY_ID(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setUpdateUser(response.data.existingUser);
      });
  }, [id]);
  if (updatedUser?.isDeleted === true) {
    return (
      <h1 className="absolute top-70 left-130 bg-black text-red-700 p-5 text-4xl">
        Your account is disabled
      </h1>
    );
  } else {
    return (
      <div className="flex items-center justify-center min-h-screen mt-10 bg-gray-100 px-4 sm:w-100 md:w-200 lg:w-250 xl:w-400">
        <ToastContainer
          position="bottom-right"
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
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full sm:w-80 md:w-160 lg:w-200 max-w-2xl text-center">
          <h1 className="text-xs font-medium text-indigo-500 uppercase tracking-wide mb-4">
            {updatedUser?.role}
          </h1>
          <img
            src={updatedUser?.avatar}
            alt="User Avatar"
            className="w-100 h-100 rounded-full mx-auto border border-gray-300 object-cover mb-6"
          />
          <AvatarUpload userId={id} />
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            {updatedUser?.username}
          </h1>
          <h2 className="text-sm text-gray-500">Email: {updatedUser?.email}</h2>
          <div>
            <div>
              createdAt:{" "}
              {new Date(updatedUser?.createdAt || "").toLocaleString()}
            </div>
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
              onClick={() =>
                navigate(`/user-activities/Update_User/${updatedUser?.id}`)
              }
            >
              edit profile
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default Profile;
