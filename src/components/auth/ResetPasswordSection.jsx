import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      await api.post(`/auth/reset-password/${token}`, { password });

      toast.success("Password reset successfully");
      navigate("/login");
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
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* header */}
      <div className="absolute top-0 left-0 m-9 text-white text-5xl font-bold">
        AUTOCHESS
      </div>

      {/* reset password form */}
      <div className="bg-white flex flex-col justify-center p-6 rounded-lg shadow-md max-w-sm w-full">
        <div className="text-left mb-7">
          <h2 className="text-4xl font-bold">Reset Password</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col w-full"
        >
          {/* NEW PASSWORD */}
          <div className="relative mb-2">
            <Label htmlFor="password" className="text-base font-medium">
              New password
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
                  <p>Enter your new password</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* NEW PASSWORD (AGAIN) */}
          <div className="relative mb-7">
            <Label htmlFor="confirmPassword" className="text-base font-medium">
              New password (again)
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
            {loading ? "CHANGING..." : "CHANGE PASSWORD"}
          </Button>
        </form>
      </div>
    </div>
  );
};
