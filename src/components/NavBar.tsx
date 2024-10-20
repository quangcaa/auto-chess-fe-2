import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { useState, useEffect } from "react";
import UserSearch from "./UserSearch";

const NavBar = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    const accessToken = localStorage.getItem("accessToken");
    const username = localStorage.getItem("username");

    // If both exist, the user is considered logged in
    if (accessToken && username) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  const handleLogin = () => {
    navigate("/login"); 
  };

  return (
    <>
      <nav className="bg-gray-100 text-gray-600 font-sans text-lg flex justify-between items-center w-full h-16">
        <ul className="flex items-center h-full ">
          <li className="flex items-center px-5 py-4 hover:bg-gray-300 h-full ">
            <Link to="/">
              <img
                src={"/favicon.png"}
                alt="AutoChess"
                className="h-10 w-auto "
              />
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="hover:bg-gray-300 transition duration-300 px-5 py-5 rounded-md h-full"
            >
              Play
            </Link>
          </li>
          <li>
            <Link
              to="/puzzles"
              className="hover:bg-gray-300 transition duration-300 px-5 py-5 rounded-md"
            >
              Puzzles
            </Link>
          </li>
          <li>
            <Link
              to="/Inbox"
              className="hover:bg-gray-300 transition duration-300 px-5 py-5 rounded-md"
            >
              Inbox
            </Link>
          </li>
          <li>
            <Link
              to="/forum"
              className="hover:bg-gray-300 transition duration-300 px-5 py-5 rounded-md"
            >
              Forum
            </Link>
          </li>
        </ul>

        <div className="flex flex-row items-center">
          {isLoggedIn ? (
            <div className="flex flex-row items-center space-x-4"> 
            <UserSearch />
            <img src="image 31.png" alt="Image 31" className="w-8 h-8" /> 
            <img src="image 32.png" alt="Image 32" className="w-8 h-8" /> 
            <ProfileDropdown />
            
          </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          )}

          
          
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default NavBar;
