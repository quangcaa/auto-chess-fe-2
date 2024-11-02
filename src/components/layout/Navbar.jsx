import { Outlet, Link } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import UserSearch from "./UserSearch";
import { RiSwordFill } from "react-icons/ri";
import { GoBellFill } from "react-icons/go";
import { useAuth } from "../../contexts/AuthContext";

export const Navbar = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <>
      <nav className="bg-main-color text-gray-700 font-sans font-semibold text-sm text-lg flex justify-between items-center w-full h-14 user-select-none">
        <ul className="flex items-center h-full ">
          {/* LOGO */}
          <li className="flex items-center px-5 py-5 hover:bg-gray-300 h-full ">
            <Link to="/">
              <img
                src={"/autochess-logo.png"}
                alt="AutoChess"
                className="h-12 w-auto mix-blend-darken hover:filter opacity-85"
              />
            </Link>
          </li>

          {/* PLAY */}
          <li>
            <Link
              to="/"
              className="hover:bg-gray-300 font-bold transition duration-300 px-5 py-5"
            >
              PLAY
            </Link>
          </li>

          {/* PUZZLE */}
          <li>
            <Link
              to="/puzzle"
              className="hover:bg-gray-300 font-bold transition duration-300 px-5 py-5"
            >
              PUZZLE
            </Link>
          </li>

          {/* INBOX */}
          <li>
            <Link
              to="/inbox"
              className="hover:bg-gray-300 font-bold transition duration-300 px-5 py-5"
            >
              INBOX
            </Link>
          </li>

          {/* FORUM */}
          <li>
            <Link
              to="/forum"
              className="hover:bg-gray-300 font-bold transition duration-300 px-5 py-5"
            >
              FORUM
            </Link>
          </li>
        </ul>

        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center space-x-4">
            <UserSearch />
            <RiSwordFill className="size-6" />
            <GoBellFill className="size-6" />
            <UserDropdown />
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
