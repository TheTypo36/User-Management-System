import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Input from "../components/Input";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { API_URLS } from "../config";
import AvatarUpload from "../components/AvatarUpload";

export const UserActivites = () => {
  const navigate = useNavigate();
  const params = useParams<{ activities: string; id?: string }>();

  const activities = params.activities;
  const id = params.id ?? "";
  const numericId = parseInt(id as string);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("USER");

  const { isLoggedIn, user, token } = useAuth();

  useEffect(() => {
    if (activities === "Update_User") {
      axios
        .get(API_URLS.GET_PROFILE_BY_ID(numericId), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          setEmail(response.data.existingUser.email);
          setUsername(response.data.existingUser.username);
          setRole(response.data.existingUser.role);
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }, [token]);

  if (!isLoggedIn) {
    navigate("/signIn");
  }
  // if (user?.role === "USER") {
  //   navigate("/profile");
  // }

  const handleSubmitBtn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activities === "Create_User") {
      axios
        .post(
          API_URLS.CREATE_USER(),
          { email, password, username, role },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        )
        .then(() => navigate("/dashboard"))
        .catch(() => toast.error("Failed to perform the task"));
    } else if (activities === "Update_User") {
      axios
        .put(
          API_URLS.UPDATE_USER(numericId),
          { id, email, password, username, role },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        )
        .then(() => {
          toast.success("User updated");

          if (user?.role == "ADMIN" || user?.role == "SUB_ADMIN") {
            navigate("/dashboard");
          } else {
            navigate("/profile");
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      toast.error("Failed to perform the task");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-20">
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
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl px-8 py-10 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-indigo-700">
          {activities} Page
        </h2>
        <form onSubmit={handleSubmitBtn} className="space-y-6">
          <Input
            type="email"
            placeholder="Enter the email"
            id="email"
            value={email}
            label="Email"
            onChangeHandler={(e) => setEmail(e.target.value)}
          />
          {activities !== "Update_User" && (
            <Input
              type="password"
              placeholder="Enter the password"
              id="password"
              value={password}
              label="Password"
              onChangeHandler={(e) => setPassword(e.target.value)}
            />
          )}
          <Input
            type="text"
            placeholder="Enter the username"
            id="username"
            value={username}
            label="Username"
            onChangeHandler={(e) => setUsername(e.target.value)}
          />
          <AvatarUpload userId={Number(id)} />
          <div>
            <label className="block text-base md:text-lg font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              className="w-full p-3 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {user?.role === "ADMIN" && <option value="ADMIN">ADMIN</option>}
              {user?.role === "ADMIN" && (
                <option value="SUB_ADMIN">SUB_ADMIN</option>
              )}
              <option value="USER">USER</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            {activities}
          </button>
        </form>

        <hr className="my-10" />

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Having second thoughts? Go to dashboard.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-2 rounded-lg transition duration-300"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
