import { useState } from "react";
import Input from "../components/Input";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password);
  };
  return (
    <div className="bg-gray-400 p-10 w-150 rounded-xl ml-50 pl-20 h-170 shadow-2xl">
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
      </form>

      <button type="submit" className="relative left-35 top-8">
        SignUp
      </button>
    </div>
  );
}

export default SignIn;
