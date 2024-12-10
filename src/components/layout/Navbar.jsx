import { Outlet, Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import UserSearch from "./UserSearch";
import { useAuth } from "@/contexts/AuthContext";
import { ViewChallengeButton } from "./ViewChallengeButton";
import { ViewNotificationButton } from "./ViewNotificationButton";

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  const checkRole = localStorage.getItem("role");

  if (!isAuthenticated) return null;

  const isAdmin = checkRole === "admin"; 

  return (
    <>
      <nav className="bg-main-color text-gray-600 text-base flex justify-between items-center w-full h-[60px] user-select-none">
        <ul className="flex items-center h-full max-h-[60px]">
          {/* LOGO */}
          <li className="flex items-center ml-5 mr-2 pb-2 text-4xl h-full group">
            <Link className="flex items-center" to="/">
              <img
                src="/favicon.png"
                className="size-10 grayscale mr-1 group-hover:grayscale-0 group-hover:-hue-rotate-60"
              />
              <div className="font-normal text-gray-700 group-hover:text-emerald-700">
                auto
              </div>
              <div className="font-normal text-gray-600 group-hover:text-emerald-600">
                chess
              </div>
            </Link>
          </li>

          {/* PLAY */}
          <li className="flex items-center h-full max-h-[60px]">
            <Link
              to="/game"
              className="flex items-center h-full hover:text-emerald-600 font-semibold transition duration-300 px-5 py-5"
            >
              PLAY
            </Link>
          </li>

          {/* PUZZLE */}
          <li className="flex items-center h-full max-h-[60px]">
            <Link
              to="/puzzle"
              className="flex items-center h-full hover:text-emerald-600 font-semibold transition duration-300 px-5 py-5"
            >
              PUZZLE
            </Link>
          </li>

          {/* INBOX */}
          <li className="flex items-center h-full max-h-[60px]">
            <Link
              to="/inbox"
              className="flex items-center h-full hover:text-emerald-600 font-semibold transition duration-300 px-5 py-5"
            >
              INBOX
            </Link>
          </li>

          {/* FORUM */}
          <li className="flex items-center h-full max-h-[60px]">
            <Link
              to="/forum"
              className="flex items-center h-full hover:text-emerald-600 font-semibold transition duration-300 px-5 py-5"
            >
              FORUM
            </Link>
          </li>

          {/* ADMIN */}
          {isAdmin && (
            <li className="flex items-center h-full max-h-[60px]">
              <Link
                to="/admin"
                className="flex items-center h-full hover:text-emerald-600 font-semibold transition duration-300 px-5 py-5"
              >
                ADMIN
              </Link>
            </li>
          )}
        </ul>

        <div className="flex items-center h-full">
          <div className="flex flex-row items-center justify-center h-full">
            <UserSearch />
            <ViewChallengeButton />
            <ViewNotificationButton />
            <UserDropdown />
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};
