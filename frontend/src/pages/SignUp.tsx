import { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "../config";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

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
        login(response.data.user, response.data.token);
        toast.success("user successfully register and logged In");
        navigate("/profile");
      })
      .catch((error) => {
        toast.error(`${error.message}`);
      });
  };
  return (
    <div className="bg-gray-400 p-10 w-150 rounded-xl ml-50 pl-20 lg:mt-40 md:mt-30 sm:mt-20 h-185 shadow-2xl mx-auto lg:ml-170">
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
      <form onSubmit={handleSubmit}>
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
        <button
          type="submit"
          className="relative left-35 top-8  bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
        >
          SignUp
        </button>
      </form>
      <hr className="my-10" />
      <h3 className="relative left-25 text-xl">Already Have an account</h3>
      <button
        onClick={() => navigate("/signIn")}
        className="relative left-37 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
      >
        signIn
      </button>
    </div>
  );
}

export default SignUp;
