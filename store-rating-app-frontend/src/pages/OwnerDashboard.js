import React from 'react';

const OwnerDashboard = () => {
  return (
    <main className="container mt-4">
      <h1 className="mb-3">Owner Dashboard</h1>
      <p className="lead">Welcome, Store Owner! Here you can manage your stores and view ratings.</p>

      <section>
        <h2>My Stores</h2>
        <p>View, add, edit, or remove your stores.</p>
        {/* Add links or components for your store management here */}
      </section>

      <section className="mt-4">
        <h2>Store Ratings</h2>
        <p>Check customer ratings and feedback for your stores.</p>
        {/* Add store ratings components or links here */}
      </section>
    </main>
  );
};

export default OwnerDashboard;
