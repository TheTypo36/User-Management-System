import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  const handlelogout = () => {
    logout();
  };
  return (
    <div className="fixed top-0 left-0 w-full h-30 flex flex-row justify-between bg-gray-700  p-5 text-red-900">
      <h1 onClick={() => navigate("/")} className="cursor-pointer">
        User Managment
      </h1>

      {isLoggedIn && (
        <div>
          <div>hello, {user?.username}</div>
          {user?.role !== "USER" && (
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          )}
          {user?.role !== "USER" && (
            <button onClick={() => navigate("/auditlog")}>Audit logs</button>
          )}
          <button onClick={handlelogout}>logout</button>
        </div>
      )}
    </div>
  );
}

export default Header;
