import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCloseAccount from "../../hooks/useCloseAccount";

export const CloseAccount = () => {
  const navigate = useNavigate();
  const { closeAccount, loading, error, success } = useCloseAccount();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await closeAccount(password);
    if (result) {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col bg-white p-12 w-full mx-auto rounded shadow-lg">
      {/* header  */}
      <div className="flex items-center pb-4 flex-row ">
        <img src="./warning.png" alt="warning" className="w-12 " />
        <p className="text-4xl  text-red-400  p-6 rounded-lg  ">
          Close Account
        </p>
      </div>

      {/* form */}
      <p className="text-base pb-4 text-gray-600">
        Are you sure you want to close your account?
      </p>
      <p className="text-base pt-4 pb-4 text-gray-600">
        Closing your account is a permanent decision. You will NEVER be able to
        log in EVER AGAIN.
      </p>
      <p className="font-bold text-base text-gray-600 py-2 rounded-md pb-2 pt-10">
        Password
      </p>
      <div className="relative mb-3 w-full">
        <input
          type={showPassword ? "text" : "password"}
          className="bg-gray-200 border w-full border-gray-300 rounded-md h-10 p-2 focus:border-blue-500 focus:ring  transition duration-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span
          className="absolute right-3 top-2 cursor-pointer text-lg text-[#555]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>
      {error && <p className="text-red-500 mt-2 text-xs">{error}</p>}
      <div className="flex flex-col mt-6">
        <hr className="my-2" />
        <div className="flex flex-row items-center justify-between w-full">
          <p
            onClick={() => navigate("/profile")}
            className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
          >
            I changed my mind, don't close my account
          </p>
          <button
            className="bg-red-600 text-white text-sm font-bold rounded-md py-2 px-4 mt-2 shadow-md hover:shadow-lg hover:bg-red-700 transition duration-200"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Closing..." : "CLOSE ACCOUNT"}
          </button>
        </div>

        {success && (
          <p className="text-green-500 mt-2">Account closed successfully!</p>
        )}
      </div>
    </div>
  );
};
