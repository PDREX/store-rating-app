const express = require('express');
const router = express.Router();
const { Store, Rating } = require('../models');
const auth = require('../middleware/auth'); // Authentication middleware
const stores = await Store.findAll({
  where: { ownerId: req.user.id },
  attributes: ['id', 'name', 'address'], // Removed 'description'
});
// GET /api/stores
// Fetch all stores along with average rating and current user's rating (protected)
router.get('/', auth, async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [{ model: Rating, attributes: ['rating', 'userId'] }],
    });

    const result = stores.map(store => {
      const ratings = store.Ratings || [];
      const totalRatings = ratings.length;

      const averageRating = totalRatings
        ? parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1))
        : 0;

      const userRating = ratings.find(r => r.userId === req.user.id)?.rating || 0;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating,
        userRating,
      };
    });

    res.status(200).json({
      success: true,
      message: 'Stores fetched successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching stores',
      error: error.message,
    });
  }
});

// GET /api/stores/my-stores
// Get stores owned by the currently logged in store_owner (protected)
router.get('/my-stores', auth, async (req, res) => {
  try {
    if (req.user.role !== 'store_owner') {
      return res.status(403).json({ message: 'Access denied: Not a store owner' });
    }

    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
      attributes: ['id', 'name', 'address', 'description'], // include fields you want
    });

    res.status(200).json({
      success: true,
      message: 'Stores fetched successfully',
      data: stores,
    });
  } catch (err) {
    console.error('Error fetching user stores:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch stores' });
  }
});

// POST /api/stores
// Create a new store (only for store owners)
router.post('/', auth, async (req, res) => {
  const { name, address } = req.body;

  if (!name || !address) {
    return res.status(400).json({
      success: false,
      message: 'Name and address are required',
    });
  }

  if (req.user.role !== 'store_owner') {
    return res.status(403).json({
      success: false,
      message: 'Only store owners can create stores',
    });
  }

  try {
    const newStore = await Store.create({
      name,
      address,
      ownerId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: newStore,
    });
  } catch (err) {
    console.error('Error creating store:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating store',
      error: err.message,
    });
  }
});

module.exports = router;
