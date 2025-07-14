import { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { showError, showSuccess } from "../utils/toastifyUtil";

function SignUp() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  if (isLoggedIn) {
    navigate("/profile");
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted:", { email, password, username });

    axios
      .post(
        API_URLS.REGISTER(),
        {
          email,
          password,
          username,
          role: "USER",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        showSuccess("successfully signedUp");
        setTimeout(() => {
          login(response.data.user, response.data.token);
          navigate("/profile");
        }, 1000);
      })
      .catch((error) => {
        showError(`${error.message}`);
      });
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
      <div className="w-full max-w-2xl mt-20 bg-white shadow-lg rounded-xl px-8 py-10 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-indigo-700">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            placeholder="Enter your email"
            id="email"
            value={email}
            label="Email"
            onChangeHandler={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Enter your password"
            id="password"
            value={password}
            label="Password"
            onChangeHandler={(e) => setPassword(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Enter your username"
            id="username"
            value={username}
            label="Username"
            onChangeHandler={(e) => setUsername(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-600 text-sm">Already have an account?</p>
          <button
            onClick={() => navigate("/signIn")}
            className="mt-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
