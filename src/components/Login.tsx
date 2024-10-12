import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface LoginProps {
  onLogin: (isLoggedIn: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === "test" && password === "password") {
      onLogin(true);
      navigate("/");
    } else {
      alert("Login information is incorrect");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-8 rounded-lg shadow-md max-w-md mx-auto mt-20">
      <h2 className="mb-6 text-2xl text-gray-800">Login</h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-green-100 w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
        />
        <div className="relative flex items-center mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-green-100 w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 pr-10"
          />
          <span
            className="absolute right-3 cursor-pointer text-gray-600 text-lg"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>
      </form>
      <div className="flex justify-between mt-6">
        <Link to="/register" className="mr-10 text-blue-500 hover:underline">
          Register
        </Link>
        <Link to="/reset-password" className="text-blue-500 hover:underline">
          Reset password
        </Link>
      </div>
    </div>
  );
};


