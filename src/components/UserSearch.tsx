import React, { useState } from "react";

const UserSearch: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-md transition-shadow duration-200 hover:shadow-lg">
  <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search..."
    className="pl-4 p-2 w-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-all duration-200"
  />
</div>

  );
};

export default UserSearch;
