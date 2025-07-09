import { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { API_URLS } from "../config";
import { useAuth } from "../contexts/AuthContext";

function SignIn() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  if (isLoggedIn) {
    navigate("/profile");
  }
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
        login(response.data.user, response.data.token);
        toast.success("user successfully logged");
        navigate("/profile");
      })
      .catch((error) => {
        console.error(error);
        toast.error("failed to log in");
      });
  };
  return (
    <div className="bg-gray-400 p-10 w-150 rounded-xl ml-50 pl-20 h-170 shadow-2xl lg:mt-60 md:mt-30 sm:mt-20">
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
      <h2 className="text-4xl font-bold ml-30 mb-15">Sign In Page</h2>
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
        <button type="submit" className="relative left-37 top-8">
          SignIn
        </button>
        <hr className="my-15" />
        <h3 className="relative left-25 -mt-10 text-xl">
          Don't have an account?
        </h3>
      </form>
      <button onClick={() => navigate("/signUp")} className="relative left-35">
        signUp
      </button>
    </div>
  );
}

export default SignIn;
