import React from 'react';

const AdminDashboard = () => {
  return (
    <main className="container mt-4">
      <h1 className="mb-3">Admin Dashboard</h1>
      <p className="lead">Welcome, Admin! Here you can manage users and stores.</p>

      <section>
        <h2>User Management</h2>
        <p>View, add, edit, or remove users.</p>
        {/* Add user management components or links here */}
      </section>

      <section className="mt-4">
        <h2>Store Management</h2>
        <p>Manage registered stores on the platform.</p>
        {/* Add store management components or links here */}
      </section>
    </main>
  );
};

export default AdminDashboard;
