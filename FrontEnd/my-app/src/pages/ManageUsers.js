import React, { useState } from 'react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const handleNewUserNameChange = (e) => {
    setNewUserName(e.target.value);
  };

  const handleNewUserEmailChange = (e) => {
    setNewUserEmail(e.target.value);
  };

  const handleAddUser = () => {
    if (newUserName.trim() === '' || newUserEmail.trim() === '') {
      alert('Please enter both name and email.');
      return;
    }
    const newUser = {
      id: Date.now(),
      name: newUserName,
      email: newUserEmail,
    };
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="page-container">
      <h2>Manage Users</h2>
      <div className="add-user-form">
        <input
          type="text"
          placeholder="Name"
          value={newUserName}
          onChange={handleNewUserNameChange}
          className="form-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUserEmail}
          onChange={handleNewUserEmailChange}
          className="form-input"
        />
        <button onClick={handleAddUser} className="btn btn-primary">
          Add User
        </button>
      </div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="2">No users added</td></tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
