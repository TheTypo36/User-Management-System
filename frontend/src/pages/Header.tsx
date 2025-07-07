import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 w-full h-30 bg-gray-700  p-5 text-red-900">
      <h1 onClick={() => navigate("/")} className="cursor-pointer">
        User Managment
      </h1>
    </div>
  );
}

export default Header;
