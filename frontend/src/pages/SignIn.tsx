import { useEffect, useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { API_URLS } from "../config";
import { useAuth } from "../contexts/AuthContext";

function SignIn() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile");
    }
  }, [isLoggedIn]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password);
    axios
      .post(
        API_URLS.LOGIN(),
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response);
        toast.success("User successfully logged in");

        setTimeout(() => {
          login(response.data.user, response.data.token);
          navigate("/profile/");
        }, 1000);
      })
      .catch((error) => {
        console.error(error);
        if (error.status == 400) {
          toast.error(`email or password is incorrect`);
        } else if (error.status == 404) {
          toast.error(`user doesn't exists`);
        } else {
          toast.error(`Failed to log in ${error}`);
        }
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer
        position="top-left"
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
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl px-8 py-10 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-indigo-700">
          Sign In
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
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-600 text-sm">Don't have an account?</p>
          <button
            onClick={() => navigate("/signUp")}
            className="mt-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
