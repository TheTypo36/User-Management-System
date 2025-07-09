import axios from "axios";
import { useEffect, useState } from "react";
import { API_URLS } from "../config";
import UserCard from "../components/UserCard";
import { useAuth, type UserData } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
interface paginationInterface {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}
const Dashboard = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [pagination, setPagination] = useState<paginationInterface>();
  const { isLoggedIn, user } = useAuth();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  if (!isLoggedIn) {
    navigate("/signIn");
  }
  if (user?.role === "USER") {
    navigate("/profile");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(API_URLS.GET_ALL_USERS(page, limit), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setAllUsers(response.data.users);
        setPagination(response.data.pagination);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [limit, page]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 mt-50">
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
          {pagination && (
            <button
              disabled={pagination.page - 1 < 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300"
              onClick={() => setPage((prev) => prev - 1)}
            >
              prev page
            </button>
          )}
          <button
            onClick={() => navigate(`/user-activites/Create_User/0`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300"
          >
            + Add New User
          </button>
          {pagination && (
            <button
              disabled={pagination.page + 1 > pagination.totalPages}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300"
              onClick={() => setPage((prev) => prev + 1)}
            >
              next page
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
