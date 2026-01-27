import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4">Login</h2>
        <input
          className="border w-full p-2 mb-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border w-full p-2 mb-4"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-600 text-white w-full py-2">Login</button>
      </form>
    </div>
  );
}
