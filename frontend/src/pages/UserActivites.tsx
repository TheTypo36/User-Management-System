import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Input from "../components/Input";
import { useAuth } from "../contexts/AuthContext";

export const UserActivites = () => {
  const navigate = useNavigate();
  const { activites } = useParams<{ activites: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    navigate("/signIn");
  }
  if (user?.role === "USER") {
    navigate("/profile");
  }
  const handleSubmitBtn = () => {
    if (activites === "CREATE_USER") {
    } else if (activites === "UPDATE_USER") {
    } else {
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
      <h2 className="text-4xl font-bold ml-30 mb-15">Sign Up Page</h2>
      <form onSubmit={handleSubmitBtn}>
        <Input
          type="email"
          placeholder="enter the email"
          id="email"
          value={email}
          label="Email"
          onChangeHandler={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="enter the password"
          id="password"
          value={password}
          label="Password"
          onChangeHandler={(e) => setPassword(e.target.value)}
        />
        <Input
          type="text"
          placeholder="enter the username"
          id="username"
          value={username}
          label="Username"
          onChangeHandler={(e) => setUsername(e.target.value)}
        />
        <button type="submit" className="relative left-35 top-8">
          {activites}
        </button>
      </form>
      <hr className="my-10" />
      <h3 className="relative left-25 text-xl">
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
