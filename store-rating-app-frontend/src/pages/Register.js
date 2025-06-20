import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user',  // add role here
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert('Registered successfully!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        {['name', 'email', 'address', 'password'].map((field) => (
          <div className="mb-3" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              className="form-control"
              value={form[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Role selection */}
        <div className="mb-3">
          <label>Role</label>
          <select
            name="role"
            className="form-select"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
