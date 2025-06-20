// routes/storeRoutes.js
const express = require('express');
const router = express.Router();
const { Store, Rating } = require('../models');
const auth = require('../middleware/auth');

// ✅ Debug Test Route
router.get('/test', (req, res) => {
  res.json({ message: '✅ Test route working!' });
});

// ✅ Main Route - GET /api/stores
router.get('/', auth, async (req, res) => {
  try {
    console.log('GET /api/stores called by:', req.user);

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

// ✅ Store Owner Only - My Stores
router.get('/mine', auth, async (req, res) => {
  try {
    if (req.user.role !== 'store_owner') {
      return res.status(403).json({ message: 'Access denied. Only store owners can view their stores.' });
    }

    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
    });

    res.json(stores);
  } catch (error) {
    console.error('Error fetching owner stores:', error);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
});

module.exports = router;
