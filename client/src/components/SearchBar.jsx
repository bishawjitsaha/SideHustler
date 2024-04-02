import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("posts");

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm, searchType);
  };

  return (
    <div className="flex items-center justify-center my-4">
      <input
        type="text"
        className="border border-gray-300 rounded-md px-4 py-2 mr-2"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="border border-gray-300 rounded-md px-4 py-2 mr-2"
        onChange={handleSearchTypeChange}
        value={searchType}
      >
        <option value="posts">Posts</option>
        <option value="users">Users</option>
        <option value="tags">Tags</option>
      </select>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;