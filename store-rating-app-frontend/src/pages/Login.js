import React, { useState } from 'react';
import api from '../api';  // Your configured axios instance
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      const { token, user } = res.data;

      // Save token, user, and role to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);  // ✅ Critical for ProtectedRoute

      alert('Login successful!');

      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin'); // Must match your Route path
          break;
        case 'store_owner':
          navigate('/owner'); // Must match your Route path
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '400px' }}>
      <h3 className="mb-3">Login</h3>
      <form onSubmit={handleSubmit}>
        {['email', 'password'].map((field) => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === 'password' ? 'password' : 'email'}
              id={field}
              name={field}
              className="form-control"
              value={form[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
