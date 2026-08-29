import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [records, setRecords] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Active');
  const [message, setMessage] = useState('');

  // Handle Staff/Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      setToken(res.data.token);
      setMessage('Logged in successfully!');
      fetchRecords(res.data.token);
    } catch (err) {
      setMessage('Login failed! Use admin / admin123');
    }
  };

  // Fetch NGO Records
  const fetchRecords = async (authToken) => {
    try {
      const res = await axios.get('http://localhost:5000/api/records', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create New Record
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/records',
        { title, category, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setCategory('');
      fetchRecords(token);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Record
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/records/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRecords(token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>NGO Operations Management Portal</h1>
      <p style={{ color: 'green' }}>{message}</p>

      {!token ? (
        <div style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px' }}>
          <h2>Staff Login</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Username: </label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Password: </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Login</button>
          </form>
          <p><small>Hint: Use <b>admin</b> and <b>admin123</b></small></p>
        </div>
      ) : (
        <div>
          <h2>Add New Campaign / Record</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
            <input
              type="text"
              placeholder="Title (e.g. Winter Clothing Drive)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Category (e.g. Relief, Medical)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
            <button type="submit">Add Record</button>
          </form>

          <h2>NGO Active Records</h2>
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f4f4f4' }}>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.title}</td>
                  <td>{r.category}</td>
                  <td>{r.status}</td>
                  <td>
                    <button onClick={() => handleDelete(r.id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;