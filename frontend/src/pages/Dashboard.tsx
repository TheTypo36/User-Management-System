import axios from "axios";
import { useEffect, useState } from "react";
import { API_URLS } from "../config";
import UserCard from "../components/UserCard";
import { useAuth, type UserData } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    navigate("/signIn");
  }
  if (user?.role === "USER") {
    navigate("/profile");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(API_URLS.GET_ALL_USERS(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setAllUsers(response.data.users);
        setPagination(response.data.setPagination);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">Dashboard</h1>
          <p className="text-lg text-gray-600">
            Welcome back,{" "}
            <span className="text-indigo-600 font-semibold">
              {user?.username}
            </span>
          </p>
          <p className="text-md text-gray-500">
            Role: <span className="uppercase font-medium">{user?.role}</span>
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
            All Users
          </h2>
          {allUsers.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No users found.
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allUsers.map((user: UserData) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate(`/user-activites/Create_User/0`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300"
          >
            + Add New User
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
