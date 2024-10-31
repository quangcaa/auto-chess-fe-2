import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import { IoInformationCircleOutline } from "react-icons/io5";

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypeNewPassword, setRetypeNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypeNewPassword, setShowRetypeNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.patch("/account/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        retype_new_password: retypeNewPassword,
      });
      const data = res.data;

      toast.success(data.message);

      //   navigate("/");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white p-6 w-full mx-auto rounded shadow-lg">
      <p className="text-4xl  text-red-400 p-6 rounded-lg   mb-4">
        Change Password
      </p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <ul className="space-y-4 pl-6 pr-6">
          <li className="bg-[#D59020] border border-gray-300 rounded-md h-14 w-full flex items-center p-3">
            <IoInformationCircleOutline className="h-full w-auto mr-2 mix-blend-darken" />
            <p className="text-base text-[#FFFFFF] rounded-md">
              Do not set a password suggested by someone else. They will use it
              to steal your account.
            </p>
          </li>
          <li>
            <p className="font-bold text-base text-gray-600 py-2 rounded-md">
              Current Password
            </p>
            <div className="relative mb-3">
              <input
                type={showCurrentPassword ? "text" : "password"}
                className="bg-gray-200 border border-gray-300 rounded-md h-10 p-3 w-full focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-3 top-2 cursor-pointer text-lg text-[#555]"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </li>
          <li>
            <p className="font-bold text-base text-gray-600 py-2 rounded-md">
              New Password
            </p>
            <div className="relative mb-3">
              <input
                type={showNewPassword ? "text" : "password"}
                className="bg-gray-200 border border-gray-300 rounded-md h-10 p-3 w-full focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-3 top-2 cursor-pointer text-lg text-[#555]"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </li>
          <li>
            <p className="font-bold text-base text-gray-600 py-2 rounded-md">
              New Password (again)
            </p>
            <div className="relative mb-3">
              <input
                type={showRetypeNewPassword ? "text" : "password"}
                className="bg-gray-200 border border-gray-300 rounded-md h-10 p-3 w-full focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200"
                value={retypeNewPassword}
                onChange={(e) => setRetypeNewPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-3 top-2 cursor-pointer text-lg text-[#555]"
                onClick={() => setShowRetypeNewPassword(!showRetypeNewPassword)}
              >
                {showRetypeNewPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </li>
        </ul>

        <hr className="my-4 border-gray-300" />
        <div className="flex justify-end mr-6">
          <button
            type="submit"
            className={`bg-blue-500 text-white text-base font-semibold rounded-md py-3 px-6 shadow hover:bg-blue-600 hover:shadow-2xl transition duration-200 `}
            disabled={loading} // Disable button while loading
          >
            {loading ? "CHANGING..." : "SUBMIT"}
          </button>
        </div>
      </form>
    </div>
  );
};
