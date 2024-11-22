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
    <div className="relative inline-block text-center">
      <span
        onClick={toggleDropdown}
        className={`cursor-pointer h-[60px] text-lg transition duration-300 pl-3 pr-3 py-5 flex items-center font-medium ${
          isOpen ? "bg-white hover:text-emerald-600" : "hover:text-emerald-600"
        }`}
      >
        {username || "Profile"}
        <FaUserCircle className="ml-2 size-6" />
      </span>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 font-medium border border-gray-300 rounded-l-lg shadow-lg bg-white">
          <div className="py-1" role="none">
            <a
              href={`/@/${username}`}
              className="block px-4 py-2 text-gray-600 flex items-center group hover:bg-emerald-600"
            >
              <FaCircle className="text-emerald-500 size-4 mr-3 group-hover:text-white" />
              <p className="group-hover:text-white">Profile</p>
            </a>
            <a
              href="/setting"
              className="block px-4 py-2 text-gray-600 flex items-center group hover:bg-emerald-600"
            >
              <IoMdSettings className="size-5 mr-2 group-hover:text-white" />
              <p className="group-hover:text-white">Setting</p>
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
