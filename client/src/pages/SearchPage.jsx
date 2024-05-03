import React, { useState } from "react";
import { SearchBar, SearchResult, SearchPostsFilters } from "../components";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearch = (searchTerm, searchType) => {
    // { data } = await axios.get(`/api/search?q=${searchTerm}&type=${searchType}`);
    // setSearchResults(data);

    // const dummySearchResults = [
    //   { id: 1, title: "Post 1", price: 10.99, date: new Date(2023, 0, 1) },
    //   { id: 2, title: "Post 2", price: 20.5, date: new Date(2023, 1, 15) },
    //   { id: 3, title: "Post 3", price: 15.75, date: new Date(2023, 2, 20) },
    //   { id: 4, title: "Post 4", price: 8.95, date: new Date(2023, 3, 10) },
    // ];

    const dummySearchResults = [
      {
        _id: "1",
        title: "Freelance Web Development Project",
        description:
          "Looking for a freelance web developer to build a responsive website for an e-commerce business.",
        taskTime: "2 weeks",
        taskPayment: "$1500",
        workType: "remote",
        posterId: "user1",
        applicants: ["user2", "user3"],
        status: "open",
        dateCreated: new Date(),
      },
      {
        _id: "2",
        title: "Graphic Design for Social Media Campaign",
        description:
          "Need a graphic designer to create engaging visuals for a social media marketing campaign.",
        taskTime: "1 week",
        taskPayment: "$500",
        workType: "remote",
        posterId: "user2",
        applicants: ["user1", "user3"],
        status: "open",
        dateCreated: new Date(),
      },
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
      {showFilters && <SearchPostsFilters handleFilter={handleFilter} />}
      {searchResults.length > 0 && <SearchResult data={filteredResults} />}
    </div>
  );
};

export default SearchPage;
