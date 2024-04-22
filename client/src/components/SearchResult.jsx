import React from "react";
import Post from "./Post";

const SearchResult = ({ data }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Search Results</h2>
      <div className="grid grid-cols-1 gap-4">
        {data.map((item) => (
          <Post key={item._id} post={item} />
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
