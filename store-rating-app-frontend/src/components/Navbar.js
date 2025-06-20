import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setRole(storedRole);
  }, [location]); // Trigger on route change to update nav in real-time

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole('');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Store Rating</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>

          {(role === 'user' || role === 'admin') && (
            <li className="nav-item">
              <Link className="nav-link" to="/stores">Stores</Link>
            </li>
          )}

          {isLoggedIn && role === 'admin' && (
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Admin Dashboard</Link>
            </li>
          )}

          {isLoggedIn && role === 'store_owner' && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/owner">Owner Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/create-store">Create Store</Link>
              </li>
            </>
          )}

          {isLoggedIn ? (
            <li className="nav-item">
              <button className="btn btn-danger ms-3" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
