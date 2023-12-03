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

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [createdTeams, setCreatedTeams] = useState([]);

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
    applyFiltersAndPagination(query);
  };

  const handleFilterChange = () => {
    if (!currentFilterType) return;
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[currentFilterType] = currentFilterValues;
      return updatedFilters;
    });
    setCurrentFilterType(null);
    setCurrentFilterValues([]);
  };

  const handleFilterApply = () => {
    if (currentFilterType) {
      handleFilterChange();
      applyFiltersAndPagination(searchQuery);
    }
  };

  const applyFiltersAndPagination = (query) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const filteredUsers = users.filter(
      (user) =>
        (user.first_name + ' ' + user.last_name).toLowerCase().includes(query) &&
        (selectedFilters.domain.length === 0 || selectedFilters.domain.includes(user.domain)) &&
        (selectedFilters.gender.length === 0 || selectedFilters.gender.includes(user.gender)) &&
        (selectedFilters.available.length === 0 || selectedFilters.available.includes(user.available.toString()))
    );

    setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
    setVisibleUsers(filteredUsers.slice(startIndex, endIndex));
  };

  const handleUserSelect = (user, isSelected) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (isSelected) {
        // If selecting, add user to the list only if it doesn't already exist
        return prevSelectedUsers.some((selectedUser) => selectedUser.id === user.id)
          ? prevSelectedUsers
          : [...prevSelectedUsers, user];
      } else {
        // If unselecting, remove user from the list
        return prevSelectedUsers.filter((selectedUser) => selectedUser.id !== user.id);
      }
    });
  };

  const handleCreateTeam = () => {
    // Add logic to create a team using selectedUsers
    // For now, let's log the team details to the console
    const teamDetails = selectedUsers.map((selectedUser) => ({
      id: selectedUser.id,
      name: `${selectedUser.first_name} ${selectedUser.last_name}`,
      domain: selectedUser.domain,
      gender: selectedUser.gender,
      email: selectedUser.email,
      available: selectedUser.available,
    }));

    setCreatedTeams((prevTeams) => [...prevTeams, teamDetails]);
    setSelectedUsers([]); // Clear selected users after creating a team

    // Uncheck checkboxes in the visibleUsers section
    setVisibleUsers((prevVisibleUsers) =>
      prevVisibleUsers.map((visibleUser) => ({
        ...visibleUser,
        isChecked: false,
      }))
    );
  };

  useEffect(() => {
    applyFiltersAndPagination(searchQuery);
  }, [users, currentPage, itemsPerPage, searchQuery, selectedFilters]);

  return (
    <div>
      <div>
        <label htmlFor="search">Search by Name: </label>
        <input type="text" id="search" value={searchQuery} onChange={handleSearch} />
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
          <option value="available">Available</option>
        </select>
      </div>

      {currentFilterType && (
        <div>
          <label>{`Filter by ${currentFilterType}: `}</label>
          <select
            multiple
            value={currentFilterValues}
            onChange={(e) => setCurrentFilterValues(Array.from(e.target.selectedOptions, (option) => option.value))}
          >
            {/* Populate options based on selected filter type */}
            {currentFilterType === 'domain' && (
              Array.from(new Set(users.map((user) => user.domain))).map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
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
                <option value="true">Available</option>
                <option value="false">Not Available</option>
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
          <UserCard
            key={user.id}
            user={user}
            onSelect={handleUserSelect}
            isChecked={selectedUsers.some((selectedUser) => selectedUser.id === user.id)}
          />
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

      {/* Team creation and display */}
      <div>
        {/* Create Team button */}
        <button onClick={handleCreateTeam}>Create Team</button>
      </div>

      {/* Display created teams */}
      <div>
        <h2>Created Teams</h2>
        {createdTeams.map((team, index) => (
          <div key={index}>
            <h3>Team {index + 1}</h3>
            {team.map((member) => (
              <UserCard key={member.id} user={member} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
