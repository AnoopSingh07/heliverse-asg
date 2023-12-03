// UserList.js

import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';

const UserList = ({ users, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleUsers, setVisibleUsers] = useState(users);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(Math.ceil(users.length / itemsPerPage));
  const [selectedFilters, setSelectedFilters] = useState({
    domain: [],
    gender: [],
    available: [],
  });

  // New state variables for dynamic filters
  const [currentFilterType, setCurrentFilterType] = useState(null);
  const [currentFilterValues, setCurrentFilterValues] = useState([]);

  const handlePageChange = (newPage) => {
    const startIndex = (newPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentPage(newPage);
    setVisibleUsers(users.slice(startIndex, endIndex));
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Apply filters and pagination based on search and filters
    applyFiltersAndPagination(query);
  };

  const handleFilterChange = () => {
    // Ensure filter type is selected
    if (!currentFilterType) return;

    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      // Use the current filter type and values
      updatedFilters[currentFilterType] = currentFilterValues;

      return updatedFilters;
    });

    // Reset filter type and values after applying the filter
    setCurrentFilterType(null);
    setCurrentFilterValues([]);
  };

  const handleFilterApply = () => {
    // Ensure filter type is selected
    if (currentFilterType) {
      // Update selected filters
      handleFilterChange();

      // Apply filters and pagination based on search and filters
      applyFiltersAndPagination(searchQuery);
    }
  };

  const applyFiltersAndPagination = (query) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const filteredUsers = users.filter(
      (user) =>
        (user.first_name + " " + user.last_name).toLowerCase().includes(query) &&
        (selectedFilters.domain.length === 0 || selectedFilters.domain.includes(user.domain)) &&
        (selectedFilters.gender.length === 0 || selectedFilters.gender.includes(user.gender)) &&
        (selectedFilters.available.length === 0 || selectedFilters.available.includes(user.available.toString()))
    );
        console.log(selectedFilters);
    // Update the total pages based on filtered users
    setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));

    // Apply pagination to the filtered users
    setVisibleUsers(filteredUsers.slice(startIndex, endIndex));
  };

  useEffect(() => {
    // Apply filters and pagination on initial load and whenever dependencies change
    applyFiltersAndPagination(searchQuery);
  }, [users, currentPage, itemsPerPage, searchQuery, selectedFilters]);

  return (
    <div>
      <div>
        <label htmlFor="search">Search by Name: </label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div>
        <label>Filter by Type: </label>
        <select
          value={currentFilterType}
          onChange={(e) => setCurrentFilterType(e.target.value)}
          disabled={!!currentFilterType}
        >
          <option value="">Select Filter Type</option>
          <option value="domain">Domain</option>
          <option value="gender">Gender</option>
          <option value="available">Availability</option>
        </select>
      </div>

      {currentFilterType && (
        <div>
          <label>{`Filter by ${currentFilterType}: `}</label>
          <select
            multiple
            value={currentFilterValues}
            onChange={(e) => setCurrentFilterValues(Array.from(e.target.selectedOptions, option => option.value))}
          >
            {/* Populate options based on selected filter type */}
            {currentFilterType === 'domain' && (
              Array.from(new Set(users.map(user => user.domain))).map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))
            )}
            {currentFilterType === 'gender' && (
              <>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </>
            )}
            {currentFilterType === 'available' && (
              <>
                <option value={true}>Available</option>
                <option value={false}>Not Available</option>
              </>
            )}
          </select>
        </div>
      )}

      <div>
        <button onClick={handleFilterApply}>Apply Filters</button>
      </div>

      <div className="user-list">
        {visibleUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
