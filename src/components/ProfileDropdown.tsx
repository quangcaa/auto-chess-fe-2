import React, { useState } from "react";
import { LogoutButton } from "./LogoutButton";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const username = localStorage.getItem("username");

  return (
    <div className="relative inline-block text-left">
      <span
        onClick={toggleDropdown}
        className="cursor-pointer text-black text-lg hover:bg-gray-300 transition duration-300 px-5 py-5"
      >
        {username || "Profile"}
      </span>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="none">
            <a
              href="/my-profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
            <a
              href="/setting"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Setting
            </a>
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            
            <LogoutButton />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
