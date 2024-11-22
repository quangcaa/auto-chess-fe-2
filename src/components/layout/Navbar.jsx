import { Outlet, Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import UserSearch from "./UserSearch";
import { RiSwordFill } from "react-icons/ri";
import { GoBellFill } from "react-icons/go";
import { useAuth } from "../../contexts/AuthContext";
import { ViewChallengeButton } from "./ViewChallengeButton";
import { ViewNotificationButton } from "./ViewNotificationButton";

export const Navbar = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <>
      <nav className="bg-main-color text-gray-600 text-base flex justify-between items-center w-full h-[60px] user-select-none">
        <ul className="flex items-center h-full">
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
          <li>
            <Link
              to="/game"
              className="hover:text-emerald-600 font-semibold transition duration-300 px-5 py-5"
            >
              PLAY
            </Link>
          </li>

          {/* PUZZLE */}
          <li>
            <Link
              to="/puzzle"
              className="hover:text-emerald-600 font-semibold transition duration-300 px-5 py-5"
            >
              PUZZLE
            </Link>
          </li>

          {/* INBOX */}
          <li>
            <Link
              to="/inbox"
              className="hover:text-emerald-600 font-semibold transition duration-300 px-5 py-5"
            >
              INBOX
            </Link>
          </li>

          {/* FORUM */}
          <li>
            <Link
              to="/forum"
              className="hover:text-emerald-600 font-semibold transition duration-300 px-5 py-5"
            >
              FORUM
            </Link>
          </li>
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

export default Navbar;
