import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

import ProfileDropdown from "../ProfileDropdown"
import UserSearch from "../UserSearch"

import { RiSwordFill } from "react-icons/ri"
import { GoBellFill } from "react-icons/go"

const NavBar = () => {
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    const username = localStorage.getItem("username")

    // If both exist, the user is considered logged in
    if (accessToken && username) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [location])

  const handleLogin = () => {
    navigate("/login")
  }

  return (
    <>
      <nav className="bg-main-color text-gray-700 font-sans font-semibold text-sm text-lg flex justify-between items-center w-full h-14 user-select-none">
        <ul className="flex items-center h-full ">
          <li className="flex items-center px-5 py-5 hover:bg-gray-300 h-full ">
            <Link to="/">
              <img
                src={"/autochess-logo.png"}
                alt="AutoChess"
                className="h-12 w-auto mix-blend-darken hover:filter opacity-85"
              />
            </Link>
          </li>

          <li>
            <Link
              to="/"
              className="hover:bg-gray-300 font-bold transition duration-300 px-5 py-5"
            >
              PLAY
            </Link>
          </li>

          <li>
            <Link
              to="/puzzles"
              className="hover:bg-gray-300 font-bold transition duration-300 px-5 py-5"
            >
              PUZZLE
            </Link>
          </li>

          <li>
            <Link
              to="/inbox"
              className="hover:bg-gray-300 font-bold transition duration-300 px-5 py-5"
            >
              INBOX
            </Link>
          </li>

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
          {isLoggedIn ? (
            <div className="flex flex-row items-center space-x-4">
              <UserSearch />
              <RiSwordFill className="size-6"/>
              <GoBellFill className="size-6"/>
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
  )
}

export default NavBar