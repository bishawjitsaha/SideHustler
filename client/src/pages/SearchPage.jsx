import React, { useState } from "react";
import axios from "axios";
import { SearchBar, SearchResult, SearchPostsFilters } from "../components";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearch = async (searchTerm, searchType) => {
    try {
      console.log(searchTerm, searchType);
      console.log(`http://localhost:3000/search?${searchType}=${searchTerm}`);
      const { data } = await axios.get(
        `http://localhost:3000/search?${searchType}=${searchTerm}`
      );
      console.log(data);
      setSearchResults(data.users);
      setFilteredResults(data.users);

      // const dummySearchResults = [
      //   {
      //     _id: "1",
      //     title: "Freelance Web Development Project",
      //     description:
      //       "Looking for a freelance web developer to build a responsive website for an e-commerce business.",
      //     taskTime: "2 weeks",
      //     taskPayment: "$1500",
      //     workType: "remote",
      //     posterId: "user1",
      //     applicants: ["user2", "user3"],
      //     status: "open",
      //     dateCreated: new Date(),
      //   },
      //   {
      //     _id: "2",
      //     title: "Graphic Design for Social Media Campaign",
      //     description:
      //       "Need a graphic designer to create engaging visuals for a social media marketing campaign.",
      //     taskTime: "1 week",
      //     taskPayment: "$500",
      //     workType: "remote",
      //     posterId: "user2",
      //     applicants: ["user1", "user3"],
      //     status: "open",
      //     dateCreated: new Date(),
      //   },
      // ];

      // setSearchResults(dummySearchResults);
      // setFilteredResults(dummySearchResults);

      if (searchType === "users") setShowFilters(false);
      else setShowFilters(true);
    } catch (error) {
      console.error(error);
    }
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
      {showFilters && <SearchPostsFilters handleFilter={handleFilter} />}
      {searchResults.length > 0 && <SearchResult data={filteredResults} />}
    </div>
  );
};

export default SearchPage;
