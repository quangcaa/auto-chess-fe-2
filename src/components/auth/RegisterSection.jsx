import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../ui/tooltip";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      const data = res.data;

      toast.success("Account created successfully");

      login(data.accessToken, data.refreshToken, data.user.username);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cover bg-center h-screen" style={{ backgroundImage: "url('public/background.jpeg')" }}>
      {/* header */}
      <div className="container mx-auto flex justify-center">
        <img
          src="autochess-logo.png"
          className="h-auto w-auto mix-blend-darken"
        />
      </div>

      {/* register form */}
      <div className="bg-white bg-opacity-50 backdrop-blur-md flex flex-col items-center justify-center p-8 rounded-lg shadow-md max-w-md mx-auto mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Register
        </h2>

        <form noValidate onSubmit={handleSubmit} className="flex flex-col w-full">
          {/* USERNAME */}
          <div className="mb-4 relative">
            <Label htmlFor="username" className="text-base font-semibold mb-2">
              Username
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      id="username"
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-[#F1F7EC] w-full p-3 pl-10 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  </TooltipTrigger>
                <TooltipContent className="bg-blue-600 text-white text-sm p-2 rounded-lg shadow-lg" side="top" sideOffset={5}>
                  <p>Enter a unique username</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* EMAIL */}
          <div className="mb-4 relative">
            <Label htmlFor="email" className="text-base font-semibold mb-2">
              Email
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="email"
                      id="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-[#F1F7EC] w-full p-3 pl-10 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-blue-600 text-white text-sm p-2 rounded-lg shadow-lg" side="top" sideOffset={5}>
                  <p>Enter your email address</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* PASSWORD */}
          <div className="mb-4 relative">
            <Label htmlFor="password" className="text-base font-semibold mb-2">
              Password
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative flex items-center">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-[#F1F7EC] w-full p-3 pl-10 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 pr-3"
                    />
                  </div>
                  </TooltipTrigger>
                <TooltipContent className="bg-blue-600 text-white text-sm p-2 rounded-lg shadow-lg" side="top" sideOffset={5}>
                  <p>Enter your password</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-4 relative">
            <Label htmlFor="confirmPassword" className="text-base font-semibold mb-2">
              Confirm Password
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative flex items-center">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-[#F1F7EC] w-full p-3 pl-10 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 pr-3"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-blue-600 text-white text-sm p-2 rounded-lg shadow-lg" side="top" sideOffset={5}>
                  <p>Confirm your password</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Button
            type="submit"
            variant={loading ? "default" : "blue"}
            className={`mt-3 w-full py-3 bg-black hover:bg-gray-600 text-base text-white font-bold rounded-lg transition duration-300 ${
              loading
                ? "bg-black cursor-not-allowed"
                : "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            }`}
            disabled={loading}
          >
            {loading ? "REGISTERING..." : "REGISTER"}
          </Button>
        </form>

        {/* FOOTER */}
        <div className="mt-5 flex justify-between gap-2">
          <p className="text-gray-600">Already have an account?</p>
          <Link 
            to="/login" 
            className="text-gray-800 underline hover:text-[#007bff]"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};