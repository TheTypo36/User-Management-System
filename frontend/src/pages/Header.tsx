import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  const handlelogout = () => {
    logout();
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-md z-50 min-h-20 h-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer hover:text-indigo-400 transition text-center sm:text-left"
        >
          User Management
        </h1>

        {isLoggedIn && (
          <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-center sm:text-left">
            <div className="text-gray-300">
              Hello,{" "}
              <span className="font-semibold text-white">{user?.username}</span>
            </div>

            {user?.role !== "USER" && (
              <button
                onClick={() => navigate("/dashboard")}
                className="hover:text-indigo-400 transition"
              >
                Dashboard
              </button>
            )}

            {user?.role !== "USER" && (
              <button
                onClick={() => navigate("/auditlog")}
                className="hover:text-indigo-400 transition"
              >
                Audit Logs
              </button>
            )}

            <button
              onClick={handlelogout}
              className="text-red-400 hover:text-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
