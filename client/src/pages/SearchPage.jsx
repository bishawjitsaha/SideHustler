import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { SearchBar, SearchResult, SearchPostsFilters } from "../components";
import { AuthContext } from "../context/AuthContext";

const SearchPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearch = async (searchTerm, searchType) => {
    if (searchType === "tags" && searchTerm === "") {
      alert("Please select a tag.");
      return false;
    }
    if (searchType === "users" && searchTerm === "") {
      alert("Please enter a Username.")
      return false;
    }
    try {
      if (!currentUser) return;

      let query = searchTerm ? `${searchType}=${searchTerm}` : `${searchType}=`
      const { data } = await axios.get(
        `http://localhost:3000/search?${query}`
        , {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`
          }
        });
      setSearchResults(data[`${searchType}`]);
      setFilteredResults(data[`${searchType}`]);

      if (searchType === "users") setShowFilters(false);
      else setShowFilters(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilter = ({ priceRange, dateRange }) => {
    if (searchResults.length === 0) return;
    let filteredResults = [...searchResults];

    if (priceRange.min !== "" && priceRange.max !== "") {
      filteredResults = filteredResults.filter((item) => {
        const itemPrice = parseFloat(item.taskPayment);
        return itemPrice >= parseFloat(priceRange.min) && itemPrice <= parseFloat(priceRange.max);
      });
    }

    if (dateRange.startDate !== "" && dateRange.endDate !== "") {
      filteredResults = filteredResults.filter((item) => {
        const itemDate = new Date(item.taskTime.dateStart);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredResults(filteredResults);
  };

  useEffect(() => {

  }, [currentUser]);

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {showFilters && <SearchPostsFilters handleFilter={handleFilter} />}
      {searchResults && searchResults.length > 0 && <SearchResult data={filteredResults} />}
    </div>
  );
};

export default SearchPage;
