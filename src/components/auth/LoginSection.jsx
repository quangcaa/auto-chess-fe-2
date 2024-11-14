import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../ui/tooltip";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Username and password are required.");
      return;
    }
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });
      const data = res.data;

      toast.success("Logged in successfully");

      login(
        data.accessToken,
        data.refreshToken,
        data.user.username,
        data.user.user_id
      );
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-cover bg-center h-screen" style={{ backgroundImage: "url('public/background.png')" }}>
      {/* header */}
      <div className="container mx-auto flex justify-center">
        <img
          src="autochess-logo.png"
          className="h-auto w-auto mix-blend-darken"
        />
      </div>

      {/* login form */}
      <div className="bg-white backdrop-blur-sm flex flex-col items-center justify-center p-3 rounded-lg shadow-md max-w-md mx-auto mt-20 border border-gray-300">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Login
          </h2>
          <div className="mt-2">
            <Label htmlFor="login-email" className="text-[14px] font-normal text-gray-800">
              Enter your registered username below to login.
            </Label>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col w-full">
          {/* USERNAME */}
          <div className="relative mb-3">
            <Label htmlFor="username" className="text-base font-semibold mb-5 mt-2">
              Username
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative flex items-center">
                    <FaUser className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-[#F1F7EC] border border-[#ddd] rounded-lg w-full p-3 pl-10 pr-3 transition duration-300 focus:border-[#007bff] focus:outline-none focus:ring focus:ring-[#007bff] focus:ring-opacity-30"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-blue-600 text-white text-sm p-2 rounded-lg shadow-lg" side="top" sideOffset={5}>
                  <p>Enter your username</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* PASSWORD */}
          <div className="relative mb-3">
            <Label htmlFor="password" className="mb-5 mt-2 text-base font-semibold">
              Password
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative flex items-center">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-[#F1F7EC] border border-[#ddd] rounded-lg w-full p-3 pl-10 pr-3 transition duration-300 focus:border-[#007bff] focus:outline-none focus:ring focus:ring-[#007bff] focus:ring-opacity-30"
                    />
                    <span
                      className="absolute right-3.5 top-3 cursor-pointer text-lg text-[#555]"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-blue-600 text-white text-sm p-2 rounded-lg shadow-lg" side="top" sideOffset={5}>
                  <p>Enter your password</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="mt-2 text-right">
            <Link
              to="/reset-password"
              className="text-gray-800 text-sm hover:text-[#007bff] underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login button*/}
          <Button
            type="submit"
            variant={loading ? "default" : "blue"}
            size="lg"
            className={`mt-3 w-full py-3 bg-black text-white text-[15px] ${loading ? "cursor-not-allowed" : "hover:bg-gray-700 focus:ring-gray-500"}`}
            disabled={loading}
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
            <FaSignInAlt className="mr-2" />
          </Button>
        </form>

        {/* FOOTER */}
        <div className="mt-5 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-gray-800 underline hover:text-[#007bff]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
