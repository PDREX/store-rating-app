import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('Please login to view stores');
      return;
    }
    fetchStores();
  }, [token]);

  const fetchStores = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/stores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Expecting res.data.data to be array of stores
      setStores(res.data.data || []);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setError('Failed to load stores.');
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (storeId, ratingValue) => {
    if (!token) {
      alert('Please log in to rate stores');
      return;
    }
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert('Rating must be between 1 and 5');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/ratings',
        { storeId, rating: ratingValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Rating submitted!');
      fetchStores(); // Refresh list to update ratings
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating');
    }
  };

  // Star rating input component
  const StarRatingInput = ({ currentRating, onRate }) => (
    <div>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => onRate(star)}
          style={{
            cursor: 'pointer',
            color: star <= currentRating ? '#ffc107' : '#e4e5e9',
            fontSize: '1.5rem',
            userSelect: 'none',
          }}
          aria-label={`${star} star`}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') onRate(star);
          }}
        >
          ★
        </span>
      ))}
    </div>
  );

  // Filter stores by search term (case insensitive)
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(search.toLowerCase()) ||
    store.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Stores</h2>

      <input
        type="text"
        placeholder="Search by store name or address"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="form-control mb-3"
        aria-label="Search stores"
      />

      {loading && <p>Loading stores...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && filteredStores.length === 0 && <p>No stores found.</p>}

      <ul className="list-group">
        {filteredStores.map(store => (
          <li
            key={store.id}
            className="list-group-item d-flex justify-content-between align-items-center flex-column flex-md-row"
          >
            <div>
              <h5>{store.name}</h5>
              <p>{store.address}</p>
              <p>
                Average Rating: {store.averageRating?.toFixed(1) ?? '0.0'}{' '}
                <span style={{ color: '#ffc107' }}>★</span>
              </p>
            </div>

            <div className="text-center mt-3 mt-md-0">
              <p>Your Rating:</p>
              <StarRatingInput
                currentRating={store.userRating ?? 0}
                onRate={rating => submitRating(store.id, rating)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stores;
