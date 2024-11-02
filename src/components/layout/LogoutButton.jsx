import { AxiosError } from "axios";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import { IoLogOutSharp } from "react-icons/io5";

export const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await api.post("/auth/logout");

      if (res.data.success) {
        logout();
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
    >
      <IoLogOutSharp className="size-5 mr-2" />
      Logout
    </button>
  );
};
