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
    <div className="m-auto flex justify-center items-center flex-col ml-60 w-full h-full">
      <h1>Hey Everyone</h1>
      <button onClick={() => navigate("/signUp")}>SignUp</button>
      <button onClick={() => navigate("/signIn")}>SignIn</button>
    </div>
  );
};

export default LandingPage;
