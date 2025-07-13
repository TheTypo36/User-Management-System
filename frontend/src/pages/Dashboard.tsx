import axios from "axios";
import { useEffect, useState } from "react";
import { API_URLS } from "../config";
import UserCard from "../components/UserCard";
import { useAuth, type UserData } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import _ from "lodash";

interface paginationInterface {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const [allUsers, setAllUsers] = useState([]);
  const [pagination, setPagination] = useState<paginationInterface>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [changeui, setChangeui] = useState(0);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signIn");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (user?.role === "USER") {
      navigate("/profile");
    }
  }, [user?.role]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        axios
          .get(API_URLS.GET_ALL_USERS(page, limit, search), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          })
          .then((response) => {
            setAllUsers(response.data.users);
            setPagination(response.data.pagination);
            console.log(
              "page",
              pagination?.page,
              "total page",
              pagination?.totalPages
            );
          });
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    const debounced = _.debounce(fetchData, 500);
    debounced();

    return () => {
      debounced.cancel();
    };
  }, [page, limit, search, changeui]);

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

        {/* Search */}
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
            All Users
          </h2>

          <Input
            label="Search"
            type="text"
            placeholder="Search the user..."
            id="search"
            onChangeHandler={(e) => setSearch(e.target.value)}
            value={search}
          />

          {allUsers.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No users found.
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
              {allUsers.map((user: UserData) => (
                <UserCard key={user.id} user={user} setChangeui={setChangeui} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination & Create */}
        <div className="flex justify-center">
          {pagination && (
            <button
              disabled={pagination.page - 1 < 1}
              className={`${
                pagination.page === 1
                  ? "bg-indigo-400 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } m-3  font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300`}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev Page
            </button>
          )}

          <button
            onClick={() => navigate(`/user-activities/Create_User/0`)}
            className="m-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300"
          >
            + Add New User
          </button>

          {pagination && (
            <button
              disabled={pagination.page === pagination.totalPages}
              className={`${
                pagination.page === pagination.totalPages
                  ? "bg-indigo-400 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } m-3  font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300`}
              onClick={() =>
                setPage((prev) =>
                  prev + 1 <= pagination.totalPages ? prev + 1 : prev
                )
              }
            >
              Next Page
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
