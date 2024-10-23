import React, { useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";

const UserSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100); // Delay to ensure smooth transition
  };

  const handleBlur = () => {
    if (!query) {
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative flex items-center">
      <FaSearch
        onClick={handleIconClick}
        size='22'
        className={`text-gray-700 cursor-pointer transition-transform duration-300 ${isExpanded ? "transform translate-x-2" : ""
          }`}
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={handleBlur}
        placeholder="Search"
        className={`p-2 pr-0 font-base text-gray-700 placeholder-gray-500 transition-all duration-300 ${isExpanded ? "w-48 opacity-100 bg-main-color ml-4" : "w-0 opacity-0"
          }`}
        style={{ width: isExpanded ? "12rem" : "0" }}
      />
    </div>
  );
};

export default UserSearch;