import React, { useState } from 'react';
import axios from 'axios';

const CreateStore = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !address) {
      setMessage('Please enter both name and address');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/stores',
        { name, address },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
      setName('');
      setAddress('');
    } catch (err) {
      setMessage('Failed to create store');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Store</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Store Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Address</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Store
        </button>
      </form>
    </div>
  );
};

export default CreateStore;
