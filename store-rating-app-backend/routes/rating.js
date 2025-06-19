const express = require('express');
const router = express.Router();
const { submitOrUpdateRating, getMyRatings } = require('../controllers/ratingController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/:storeId/rate', verifyToken, requireRole(['user']), submitOrUpdateRating);
router.get('/mine', verifyToken, requireRole(['user']), getMyRatings);

module.exports = router;
