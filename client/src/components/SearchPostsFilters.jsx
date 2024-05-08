import React, { useState } from "react";

const SearchPostFilters = ({ handleFilter }) => {
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange({ ...priceRange, [name]: value });
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({ ...dateRange, [name]: value });
  };

  const applyFilters = () => {
    handleFilter({ priceRange, dateRange });
  };

  return (
    <div className="my-4">
      <div className="flex mb-2">
        <input
          type="number"
          className="border border-gray-300 rounded-md px-4 py-2 mr-2"
          placeholder="Min Price"
          name="min"
          value={priceRange.min}
          onChange={handlePriceRangeChange}
        />
        <input
          type="number"
          className="border border-gray-300 rounded-md px-4 py-2"
          placeholder="Max Price"
          name="max"
          value={priceRange.max}
          onChange={handlePriceRangeChange}
        />
      </div>
      <div className="flex mb-2">
        <input
          type="date"
          className="border border-gray-300 rounded-md px-4 py-2 mr-2"
          name="startDate"
          value={dateRange.startDate}
          onChange={handleDateRangeChange}
        />
        <input
          type="date"
          className="border border-gray-300 rounded-md px-4 py-2"
          name="endDate"
          value={dateRange.endDate}
          onChange={handleDateRangeChange}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={applyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default SearchPostFilters;
