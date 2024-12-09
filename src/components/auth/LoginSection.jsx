import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/utils/axios";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

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
    <div
      className="bg-cover bg-center h-screen flex flex-col justify-center items-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* header */}
      <div className="absolute top-0 left-0 m-9 text-white text-5xl font-bold">
        AUTOCHESS
      </div>

      {/* login form */}
      <div className="bg-white flex flex-col justify-center p-6 rounded-lg shadow-md max-w-sm w-full">
        <div className="text-left mb-7">
          <h2 className="text-4xl font-bold">Login</h2>
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
                  <p>Enter your username</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* PASSWORD */}
          <div className="relative mb-7">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <Label htmlFor="password" className="text-base font-medium">
                  Password
                </Label>
              </div>
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-base hover:text-emerald-600 underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative flex items-center">
                      <input
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
          </div>

          {/* LOGIN BUTTON */}
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
            {loading ? "LOGGING IN..." : "LOGIN"}
          </Button>
        </form>

        {/* FOOTER */}
        <div className="text-center">
          <p>
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline hover:text-emerald-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
