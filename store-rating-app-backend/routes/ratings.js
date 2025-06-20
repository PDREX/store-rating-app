const express = require('express');
const router = express.Router();
const { Rating } = require('../models');
const auth = require('../middleware/auth'); // JWT authentication middleware

// GET /api/ratings/user - Get all ratings by the logged-in user
router.get('/user', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const ratings = await Rating.findAll({ where: { userId } });

    res.status(200).json({
      success: true,
      message: 'User ratings fetched successfully',
      data: ratings,
    });
  } catch (err) {
    console.error('Error fetching user ratings:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching user ratings',
      error: err.message,
    });
  }
});

// POST /api/ratings - Submit or update a rating for a store
router.post('/', auth, async (req, res) => {
  const { storeId, rating } = req.body;

  // Validate input
  if (!storeId) {
    return res.status(400).json({
      success: false,
      message: 'Store ID is required',
    });
  }
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be a number between 1 and 5',
    });
  }

  const userId = req.user.id;

  try {
    // Use a transaction to avoid locking issues
    const result = await Rating.sequelize.transaction(async (t) => {
      const existingRating = await Rating.findOne({
        where: { userId, storeId },
        transaction: t,
        lock: t.LOCK.UPDATE, // Optional: Lock row for update
      });

      if (existingRating) {
        existingRating.rating = rating;
        await existingRating.save({ transaction: t });
        return { updated: true, rating: existingRating };
      } else {
        const newRating = await Rating.create(
          { storeId, userId, rating },
          { transaction: t }
        );
        return { updated: false, rating: newRating };
      }
    });

    if (result.updated) {
      return res.status(200).json({
        success: true,
        message: 'Rating updated successfully',
        data: result.rating,
      });
    } else {
      return res.status(201).json({
        success: true,
        message: 'Rating submitted successfully',
        data: result.rating,
      });
    }
  } catch (err) {
    console.error('Error submitting rating:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting rating',
      error: err.message,
    });
  }
});

module.exports = router;
