import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import api from "../../utils/axios";
import { useAuth } from "../../contexts/AuthContext";

export const CloseAccount = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.delete("/account/close-account", {
        data: { password },
      });
      const data = res.data;

      toast.success(data.message);

      logout();
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white p-8 w-full mx-auto rounded shadow-lg">
      {/* header  */}
      <div className="flex items-center mb-6">
        {/* <img src={warningImage} alt="warning" className="w-12 pr-2" /> */}
        <p className="text-3xl text-red-500">Close Account</p>
      </div>

      {/* form */}
      <p className="text-sm">Are you sure you want to close your account?</p>
      <p className="text-sm">
        Closing your account is a permanent decision. You will NEVER be able to
        log in EVER AGAIN.
      </p>
      <p className="font-bold mt-5 text-sm">Password</p>
      <input
        type="password"
        className="bg-gray-200 border-none rounded-md h-8 w-full p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="flex flex-col mt-6">
        <hr className="my-2" />
        <div className="flex justify-center">
          <button
            className="bg-red-500 text-white text-sm font-bold rounded-md py-2 px-4 mt-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "CLOSING..." : "CLOSE ACCOUNT"}
          </button>
        </div>
      </div>
    </div>
  );
};
