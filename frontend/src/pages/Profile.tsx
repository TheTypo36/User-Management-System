import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    navigate("/signIn");
  }
  if (user?.isDeleted === true) {
    return <h1>Your account is disabled</h1>;
  } else {
    return (
      <div className="flex items-center justify-center min-h-screen mt-10 bg-gray-100 px-4 sm:w-100 md:w-200 lg:w-250 xl:w-400">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full sm:w-80 md:w-160 lg:w-200 max-w-2xl text-center">
          <h1 className="text-xs font-medium text-indigo-500 uppercase tracking-wide mb-4">
            {user?.role}
          </h1>
          <img
            src={user?.avatar ? user?.avatar : "./avatar.webp"}
            alt="User Avatar"
            className="w-100 h-100 rounded-full mx-auto border border-gray-300 object-cover mb-6"
          />
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            {user?.username}
          </h1>
          <h2 className="text-sm text-gray-500">Email: {user?.email}</h2>
          <div>
            <div>
              createdAt: {new Date(user?.createdAt || "").toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Profile;
