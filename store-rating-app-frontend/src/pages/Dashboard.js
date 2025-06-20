import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    else window.location.href = '/login';
  }, []);

  return (
    <div className="container">
      <h3>Dashboard</h3>
      {user && <p>Welcome, {user.name} ({user.role})</p>}
    </div>
  );
};

export default Dashboard;
