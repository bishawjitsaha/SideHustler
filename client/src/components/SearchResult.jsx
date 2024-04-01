import React from "react";

const SearchResult = ({ data }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Search Results</h2>
      <div className="grid grid-cols-1 gap-4">
        {data.map((item) => (
          <div key={item.id} className="border border-gray-300 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">Price: ${item.price}</p>
            <p className="text-gray-600">Date: {item.date.toDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
