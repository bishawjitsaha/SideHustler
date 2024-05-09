import React from "react";
import { Post, User } from "./";

const SearchResult = ({ data }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{data.length} Search Results</h2>
      <div className="grid grid-cols-1 gap-4">
        {data.map((item, index) => (
          <div key={index}>
            {item.hasOwnProperty("taskTime") ? 
                // <Post post={item} status={item.status}/>
                <div key={item._id} className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                    <Link to={`/user/${item.posterUsername}`} className="text-teal-500 text-left font-bold text-xl hover:text-teal-200 mb-4">
                        {item.posterUsername}
                    </Link>
                    <Link to={`/post/${item._id}`} className="transform transition duration-250 ease-in-out hover:scale-105">
                        <Post post={item} status={item.status} />
                    </Link> 
                </div>
                : <User user={item} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
