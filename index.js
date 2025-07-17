import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]); // Ensure initial state is an array
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Backend API URL (replace with your actual backend URL)
  const API_URL = process.env.REACT_APP_API_URL || 'https://check-front.vercel.app/api/users';

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      // Ensure response.data is an array; if not, set empty array
      setUsers(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again later.');
      setUsers([]); // Reset to empty array on error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a valid name.');
      return;
    }
    try {
      await axios.post(API_URL, { name });
      setName('');
      setError('');
      setSuccess('User added successfully!');
      fetchUsers(); // Refresh user list
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Add User</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter user name"
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Add User
        </button>
      </form>
      <h2>Users ({users.length})</h2>
      <ul>
        {Array.isArray(users) ? (
          users.map((user) => (
            <li key={user._id}>{user.name}</li>
          ))
        ) : (
          <li>No users available</li>
        )}
      </ul>
    </div>
  );
}

export default App;
