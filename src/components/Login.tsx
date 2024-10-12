import axios from "axios";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:3333/auth/login", {
        username,
        password,
      })

      if (res.data.success) {
        // save access token in local storage 
        localStorage.setItem("accessToken", res.data.accessToken)

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
    <div className="flex flex-col items-center justify-center min-h-screen ">
      {/* header */}
      <div className="container mx-auto flex justify-center">
        <img
          src="autochess-logo.png"
          className="h-auto w-auto mix-blend-darken"
        />
      </div>

      {/* login form */}
      <div className="flex-grow flex items-center mb-20">
        <div className="w-full bg-white p-10 rounded-lg shadow-md">

          <h2 className="mb-6 text-2xl text-black-700 font-semibold">Login</h2>

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

            {error && (
              <div className="mb-4 text-red-500">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
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
      </div>
    </div>
  );
};


