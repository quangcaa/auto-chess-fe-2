import { useState } from "react";
import { LogoutButton } from "./LogoutButton";
import { IoMdSettings } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const username = localStorage.getItem("username");

  return (
    <div className="relative inline-block text-left">
      <span
        onClick={toggleDropdown}
        className={`cursor-pointer text-base transition duration-300 px-3 py-5 flex items-center ${
          isOpen ? "bg-white" : "hover:bg-gray-300"
        }`}
      >
        {username || "Profile"}
        <FaUserCircle className="ml-2 size-6" />
      </span>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="none">
            <a
              href={`/@/${username}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FaCircle className="text-green-500 size-4 mr-3" />
              Profile
            </a>
            <a
              href="/setting"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <IoMdSettings className="size-5 mr-2" />
              Setting
            </a>
            <a>
              <LogoutButton />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
