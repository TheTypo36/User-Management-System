import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate("/landing-page");
  };

  const { isLoggedIn, user } = useAuth();
  console.log(user);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile");
    }
  }, []);

  return (
    <div className="sm:ml-30 lg:ml-50 min-h-screen flex sm:w-100 md:w-160 lg:w-250 flex-col justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Hello,</h1>
      <h1 className="text-2xl font-semibold text-indigo-700 mb-4">
        Systrome Networks Pvt Ltd.
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Thanks for giving me the opportunity to build an assignment project for
        you.
      </p>
      <button
        onClick={handleStart}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
      >
        Let’s Start
      </button>
    </div>
  );
}

export default App;
