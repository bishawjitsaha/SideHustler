import React from "react";
import { Post, User } from "./";
import { Link } from "react-router-dom";
const SearchResult = ({ data }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Search Results</h2>
      <div className="grid grid-cols-1 gap-4">
        {data.map((item, index) => (
          <div key={index}>
            {item.hasOwnProperty("taskTime") ? <Post post={item} status={item.status}/>: <User user={item} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
