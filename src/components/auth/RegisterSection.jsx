import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div
      className="bg-cover bg-center h-screen  flex flex-col justify-center items-center"
      style={{ backgroundImage: "url('public/background.png')" }}
    >
      {/* header */}
      <div className="absolute top-0 left-0 m-9 text-white text-5xl font-bold">
        AUTOCHESS
      </div>

      {/* register form */}
      <div className="bg-white flex flex-col justify-center p-6 rounded-lg shadow-md max-w-sm w-full">
        <div className="text-left mb-7">
          <h2 className="text-4xl font-bold">Register</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col w-full"
        >
          {/* USERNAME */}
          <div className="relative mb-2">
            <Label htmlFor="username" className="text-base font-medium">
              Username
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <input
                      id="username"
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 focus:border-emerald-600 focus:outline-none focus:ring focus:ring-emerald-600 focus:ring-opacity-30"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-emerald-600 text-white text-sm p-2 rounded-lg shadow-lg"
                  side="top"
                  sideOffset={5}
                >
                  <p>Enter a unique username</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* EMAIL */}
          <div className="relative mb-2">
            <Label htmlFor="email" className="text-base font-meidum">
              Email
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 focus:border-emerald-600 focus:outline-none focus:ring focus:ring-emerald-600 focus:ring-opacity-30"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-emerald-600 text-white text-sm p-2 rounded-lg shadow-lg"
                  side="top"
                  sideOffset={5}
                >
                  <p>Enter your email address</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* PASSWORD */}
          <div className="relative mb-2">
            <Label htmlFor="password" className="text-base font-medium">
              Password
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative flex items-center">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 focus:border-emerald-600 focus:outline-none focus:ring focus:ring-emerald-600 focus:ring-opacity-30"
                    />
                    <span
                      className="absolute right-3.5 cursor-pointer text-lg"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-emerald-600 text-white text-sm p-2 rounded-lg shadow-lg"
                  side="top"
                  sideOffset={5}
                >
                  <p>Enter your password</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative mb-7">
            <Label htmlFor="confirmPassword" className="text-base font-medium">
              Confirm Password
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative flex items-center">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="border border-gray-300 rounded-lg w-full p-3 transition duration-300 focus:border-emerald-600 focus:outline-none focus:ring focus:ring-emerald-600 focus:ring-opacity-30"
                    />
                    <span
                      className="absolute right-3.5 cursor-pointer text-lg"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-emerald-600 text-white text-sm p-2 rounded-lg shadow-lg"
                  side="top"
                  sideOffset={5}
                >
                  <p>Confirm your password</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* REGISTER BUTTON */}
          <Button
            type="submit"
            variant={loading ? "default" : "blue"}
            size="lg"
            className={`mb-3 w-full bg-black text-white text-[15px] ${
              loading
                ? "cursor-not-allowed"
                : "hover:bg-emerald-700 focus:ring-emerald-500"
            }`}
            disabled={loading}
          >
            {loading ? "REGISTERING..." : "REGISTER"}
          </Button>
        </form>

        {/* FOOTER */}
        <div className="text-center">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="underline hover:text-emerald-600">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
