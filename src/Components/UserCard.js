// UserCard.js

import React from 'react';
import './UserCard.css'; // Import your CSS for styling

const UserCard = ({ user, onSelect, isChecked }) => {
  const handleCheckboxChange = () => {
    onSelect(user, !isChecked);
  };

  return (
    <div className={`user-card ${user.available ? 'available' : 'not-available'}`}>
      {user.available && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="checkbox"
        />
      )}
      <img src={user.avatar} alt={user.name} />
      <h3>ID: {user.id} <span style={{ color: user.available ? 'green' : 'red' }}>
        &#128905;
      </span></h3>
      <h3>{user.first_name} {user.last_name}</h3>
      <p>Domain: {user.domain} | Gender: {user.gender}</p>
      <p>Email: {user.email}</p>
      {/* Add other user details as needed */}
    </div>
  );
};

export default UserCard;
