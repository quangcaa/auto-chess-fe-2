import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import api from "@/utils/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleIconClick = () => {
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleBlur = () => {
    if (!query) {
      setIsExpanded(false);
    }
  };

  const handleSearch = async () => {
    if (query.length === 0) {
      setUserList([]);
      return;
    }
    try {
      const response = await api.get(`search/${query}`);
      setUserList(response.data.users);

    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  }

  useEffect(() => {
    handleSearch(query);
  }, [query]);

  const HandleChange = (e) => {
    setQuery(e.target.value);
  }

  return (
    <div className="relative flex items-center">
      <FaSearch
        onClick={handleIconClick}
        size="22"
        className={`text-gray-700 cursor-pointer transition-transform duration-300 ${
          isExpanded ? "transform translate-x-2" : ""
        }`}
      />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={HandleChange
      
        }
        onBlur={handleBlur}
        placeholder="Search"
        className={`p-2 pr-0 font-base text-gray-700 placeholder-gray-500 transition-all duration-300 ${
          isExpanded ? "w-48 opacity-100 bg-main-color ml-4" : "w-0 opacity-0"
        }`}
        style={{ width: isExpanded ? "12rem" : "0" }}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      {query && userList.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-lg z-10 ">
          <ul className="flex flex-col max-h-60 overflow-auto">
            {userList.map((user, index) => (
              <a
                key={index}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                href={`/@/${user.username}`}
              >
                {user.username}
              </a>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
