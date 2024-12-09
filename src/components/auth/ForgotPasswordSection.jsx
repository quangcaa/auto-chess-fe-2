import { useState } from "react";
import { Link } from "react-router-dom";
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

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() == "") {
      toast.error("Email is required!");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });

      toast.success("Sent reset password link to your email successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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

      {/* forgot password form */}
      <div className="bg-white flex flex-col justify-center p-6 rounded-lg shadow-md max-w-sm w-full">
        <div className="text-left mb-7">
          <h2 className="text-4xl font-bold">Forgot Password</h2>
          <p className="mt-1 ml-0.5">
            Please enter your email to reset password
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col w-full"
        >
          <div className="relative mb-7">
            <Label htmlFor="email" className="text-base font-medium">
              Email
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <input
                      type="email"
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

          {/* FOROGT PASSWORD BUTTON */}
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
            {loading ? "SENDING..." : "SEND"}
          </Button>
        </form>

        {/* FOOTER */}
        <div className="text-center">
          <Link to="/login" className="underline hover:text-emerald-600">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};
