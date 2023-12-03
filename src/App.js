import './App.css';
import React from 'react';
import UserList from './Components/UserList';
import users from './Components/Users';
function App() {
  const itemsPerPage = 20;
  return (
    <div className="App">
      <h1>User List</h1>
      <UserList users={users} itemsPerPage={itemsPerPage} />
    </div>
  );
}

export default App;
