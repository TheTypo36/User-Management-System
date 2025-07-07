import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="m-auto flex justify-center items-center flex-col ml-60 w-full h-full">
      <h1>Hey Everyone</h1>
      <button onClick={() => navigate("/signUp")}>SignUp</button>
      <button onClick={() => navigate("/signUp")}>SignIn</button>
    </div>
  );
};

export default LandingPage;
