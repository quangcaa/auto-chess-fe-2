import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

// interface RegisterProps {
//   onRegister: (status: boolean) => void;
// }

export const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth()

  const navigate = useNavigate();
  //const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333'; // Giá trị mặc định


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    //console.log({ username, password, email }); 

    try {
      const response = await axios.post(`http://localhost:3333/auth/signup`, {
        username,
        email,
        password
      });

      if (response.data.success) {
        // onRegister(true);
        login(response.data.accessToken);
        alert("Registered successfully!");
        navigate('/verify-email');
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error(error);
      // console.error('Error details:', error.response?.data || error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div >
      <div className="container mx-auto flex justify-center">
        <img
          src="autochess-logo.png"
          className="h-auto w-auto mix-blend-darken"
        />
      </div>

      <div className="bg-white flex flex-col items-center justify-center bg-gray-100 p-8 rounded-lg shadow-md max-w-md mx-auto mt-20">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Register</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-[#F1F7EC] w-full p-3 my-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <div className="relative flex items-center my-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#F1F7EC] w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 pr-10"
            />
            <span
              className="absolute right-3 cursor-pointer text-gray-600 text-lg"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#F1F7EC] w-full p-3 my-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md text-lg mt-4 hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 cursor-pointer" onClick={handleLoginRedirect}>
          Already have an account? <span className="text-blue-500 underline hover:text-blue-700">Login</span>
        </p>
      </div>
    </div>

  );
};


