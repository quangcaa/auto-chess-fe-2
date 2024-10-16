import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`http://localhost:3333/auth/login`, {
        username,
        password,
      })

      if (res.data.success) {
        // save access token in local storage 
        localStorage.setItem("accessToken", res.data.accessToken)
        console.log("Username from response:", res.data.username);
        localStorage.setItem("username", res.data.username);

        navigate("/")
      } else {
        setError("Login information is incorrect");
      }

    } catch (error) {
      setError("Log in failed. Please check your credentials.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div >
      {/* header */}
      <div className="container mx-auto flex justify-center">
        <img
          src="autochess-logo.png"
          className="h-auto w-auto mix-blend-darken"
        />
      </div>

      {/* login form */}
      {/* <div className="flex items-center justify-center h-screen bg-[#EDEBE9] p-8"> */}
      <div className=" bg-white flex flex-col items-center justify-center bg-gray-100 p-8 rounded-lg shadow-md max-w-md mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#333]">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-[#F1F7EC] border border-[#ddd] rounded-lg w-full p-3 mb-3 transition duration-300 focus:border-[#007bff] focus:outline-none focus:ring focus:ring-[#007bff] focus:ring-opacity-30"
          />
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#F1F7EC] border border-[#ddd] rounded-lg w-full p-3 pr-12 transition duration-300 focus:border-[#007bff] focus:outline-none focus:ring focus:ring-[#007bff] focus:ring-opacity-30"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-lg text-[#555]"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <button
            type="submit"
            className="bg-[#007bff] text-white font-bold py-3 rounded-lg w-full transition duration-300 hover:bg-[#0056b3]"
          >
            Login
          </button>
        </form>
        <div className="mt-5 flex justify-between">
          <Link to="/register" className="text-[#007bff] hover:underline mr-10">
            Register
          </Link>
          <Link to="/reset-password" className="text-[#007bff] hover:underline">
            Reset password
          </Link>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};