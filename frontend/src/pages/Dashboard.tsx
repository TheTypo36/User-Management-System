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
    <div className="m-10 text-center mt-50  sm:w-120 lg:w-210">
      <h1>Dashboard</h1>
      <div>
        <h2>welcome back, {user?.username}</h2>
        <h2>role: {user?.role}</h2>
      </div>
      <div className="w-full h-auto min-h-300 p-5  m-5 lg:ml-10 bg-gray-600 flex flex-col">
        {allUsers.map((user: UserData) => (
          <UserCard user={user} />
        ))}
      </div>

      <button onClick={() => navigate(`/user-activites/Create_User`)}>
        add user
      </button>
    </div>
  );
};

export default Dashboard;
