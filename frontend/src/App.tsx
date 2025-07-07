import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate("/landing-page");
  };
  return (
    <div className="flex justify-center items-center flex-col ml-40 w-full h-full">
      <h1 className="m-5">Hello, </h1>
      <h1 className="m-5">Systrome Networks Pvt Ltd.</h1>
      <p className="m-5">
        Thanks for giving me opportunity as to build a assingment project for
        you
      </p>
      <button className="text-white" onClick={handleStart}>
        let's start
      </button>
    </div>
  );
}

export default App;
