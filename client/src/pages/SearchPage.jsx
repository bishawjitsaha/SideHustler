import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchPostFilters from "../components/SearchPostsFilters";
import SearchResult from "../components/SearchResult";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearch = (searchTerm, searchType) => {
    // { data } = await axios.get(`/api/search?q=${searchTerm}&type=${searchType}`);
    // setSearchResults(data);

    const dummySearchResults = [
      { id: 1, title: "Post 1", price: 10.99, date: new Date(2023, 0, 1) },
      { id: 2, title: "Post 2", price: 20.5, date: new Date(2023, 1, 15) },
      { id: 3, title: "Post 3", price: 15.75, date: new Date(2023, 2, 20) },
      { id: 4, title: "Post 4", price: 8.95, date: new Date(2023, 3, 10) },
    ];

    setSearchResults(dummySearchResults);
    setFilteredResults(dummySearchResults);

    if (searchType === "users") setShowFilters(false);
    else setShowFilters(true);
  };

  const handleFilter = ({ priceRange, dateRange }) => {
    let filteredResults = [...searchResults];

    if (priceRange.min !== "" && priceRange.max !== "") {
      filteredResults = filteredResults.filter(
        (item) =>
          item.price >= parseFloat(priceRange.min) &&
          item.price <= parseFloat(priceRange.max)
      );
    }

    if (dateRange.startDate !== "" && dateRange.endDate !== "") {
      filteredResults = filteredResults.filter(
        (item) =>
          item.date >= new Date(dateRange.startDate) &&
          item.date <= new Date(dateRange.endDate)
      );
    }

    setFilteredResults(filteredResults);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {showFilters && <SearchPostFilters handleFilter={handleFilter} />}
      {searchResults.length > 0 && <SearchResult data={filteredResults} />}
    </div>
  );
};

export default SearchPage;
