import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile");
    }
  }, []);

  return (
    <div className=" sm:ml-30 lg:ml-50 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-white px-4 sm:w-100 md:w-180 lg:w-250">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Hey Everyone 👋</h1>

      <div className="flex gap-6">
        <button
          onClick={() => navigate("/signUp")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Sign Up
        </button>

        <button
          onClick={() => navigate("/signIn")}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
