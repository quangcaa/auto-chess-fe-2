import { useState } from "react";
import api from "../../utils/axios";
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypeNewPassword, setRetypeNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  //   const navigate = useNavigate();

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
    <div className="flex flex-col bg-white p-8 w-full mx-auto rounded shadow-lg">
      <p className="text-3xl text-red-500">Change Password</p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <ul>
          <li>
            <p className="font-bold text-sm">Current Password</p>
            <input
              type="password"
              className="bg-gray-200 border-none rounded-md h-8 p-2 w-full"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </li>
          <li>
            <p className="font-bold mt-2 text-sm">New Password</p>
            <input
              type="password"
              className="bg-gray-200 border-none rounded-md h-8 p-2 w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </li>
          <li>
            <p className="font-bold mt-2 text-sm">New Password (again)</p>
            <input
              type="password"
              className="bg-gray-200 border-none rounded-md h-8 p-2 w-full"
              value={retypeNewPassword}
              onChange={(e) => setRetypeNewPassword(e.target.value)}
              required
            />
          </li>
        </ul>
        <div className="flex flex-col mt-6">
          <hr className="my-2" />
          <button
            type="submit"
            className="bg-blue-500 text-white text-sm font-bold rounded-md py-2 px-4 self-end"
            disabled={loading} // Disable button while loading
          >
            {loading ? "CHANGING..." : "SUBMIT"}
          </button>
        </div>
      </form>
    </div>
  );
};
