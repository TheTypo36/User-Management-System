import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Input from "../components/Input";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { API_URLS } from "../config";

export const UserActivites = () => {
  const navigate = useNavigate();
  const params = useParams<{ activities: string; id?: string }>();

  const activities = params.activities;
  console.log("activities ", activities);
  const id = params.id ?? "";

  const numericId = parseInt(id as string);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("USER");
  const { isLoggedIn, user, token } = useAuth();
  useEffect(() => {
    if (activities == "Update_User") {
      console.log(" hello ", id, numericId);
      axios
        .get(API_URLS.GET_PROFILE_BY_ID(numericId), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
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
  if (user?.role === "USER") {
    navigate("/profile");
  }
  const handleSubmitBtn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(activities);
    if (activities === "Create_User") {
      axios
        .post(
          API_URLS.CREATE_USER(),
          {
            email,
            password,
            username,
            role,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        )
        .then((Response) => {
          console.log(Response);
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error(error);
          toast.error("failed to perform the task");
        });
    } else if (activities === "Update_User") {
      axios
        .put(
          API_URLS.UPDATE_USER(numericId),
          {
            id,
            email,
            password,
            username,
            role,
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
          toast.success("user updates");
          navigate("/dashboard");
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      toast.error("failed to perform the task");
    }
  };
  return (
    <div className="bg-gray-400 p-10 w-150 rounded-xl ml-50 pl-20 lg:mt-60 md:mt-30 sm:mt-20 h-200 shadow-2xl mx-auto">
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
      <h2 className="text-4xl font-bold ml-20 mb-5">{activities} Page</h2>
      <form onSubmit={handleSubmitBtn}>
        <Input
          type="email"
          placeholder="enter the email"
          id="email"
          value={email}
          label="Email"
          onChangeHandler={(e) => setEmail(e.target.value)}
        />
        {activities !== "Update_User" && (
          <Input
            type="password"
            placeholder="enter the password"
            id="password"
            value={password}
            label="Password"
            onChangeHandler={(e) => setPassword(e.target.value)}
          />
        )}
        <Input
          type="text"
          placeholder="enter the username"
          id="username"
          value={username}
          label="Username"
          onChangeHandler={(e) => setUsername(e.target.value)}
        />
        <h2 className="text-xl ">Role: </h2>
        <select
          className="bg-amber-50 w-30 h-10 shadow-2xs p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {user?.role === "ADMIN" && <option value="ADMIN">ADMIN</option>}
          {user?.role === "ADMIN" && (
            <option value="SUB_ADMIN">SUB_ADMIN</option>
          )}
          <option defaultChecked value="USER">
            USER
          </option>
        </select>
        <button type="submit" className="relative left-4 top-15">
          {activities}
        </button>
      </form>
      <hr className="mt-20 mb-10" />
      <h3 className="relative left-15 text-xl">
        Having seconds thought , go to dashboard
      </h3>
      <button
        onClick={() => navigate("/dashboard")}
        className="relative left-35"
      >
        Dashboard
      </button>
    </div>
  );
};
