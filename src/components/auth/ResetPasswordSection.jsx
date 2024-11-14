import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { FaEnvelope } from "react-icons/fa";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../ui/tooltip";

export const ResetPassword = () => {
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
    <div className="bg-cover bg-center h-screen"
        style={{ backgroundImage: "url('public/background.png')" }}>
      {/* header */}
      <div className="container mx-auto flex justify-center">
        <img
          src="autochess-logo.png"
          className="h-auto w-auto mix-blend-darken"
        />
      </div>

      {/* reset password form  */}
      <div className="bg-white mt-20 backdrop-blur-md p-8 rounded-lg shadow-md max-w-md w-full mx-auto border border-gray-300">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Reset password
        </h2>

        <form noValidate onSubmit={handleSubmit} className="flex flex-col  w-full ">
          <p className="mb-2 text-gray-700">
            Please enter your email to authenticate your account
          </p>
          
          <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative w-full mb-4">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full p-3 pl-10 bg-[#F1F7EC] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-blue-600 text-white text-sm p-2 rounded-lg shadow-lg" side="top" sideOffset={5}>
                  <p>Enter your email address</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          <button
            type="submit"
            className={`w-full py-3 bg-black hover:bg-gray-600 text-base text-white font-bold rounded-lg transition duration-300 ${
              loading
                ? "bg-black cursor-not-allowed"
                : "bg-black-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            }`}
            disabled={loading}
          >
            {loading ? "SENDING..." : "SEND"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-500 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};
