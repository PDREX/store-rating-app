const { Rating } = require('../models');

exports.submitOrUpdateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.userId;

    let ratingEntry = await Rating.findOne({ where: { storeId, userId } });

    if (ratingEntry) {
      ratingEntry.rating = rating;
      await ratingEntry.save();
      return res.json({ message: 'Rating updated', rating: ratingEntry });
    }

    const newRating = await Rating.create({ storeId, userId, rating });
    res.status(201).json({ message: 'Rating submitted', rating: newRating });
  } catch (err) {
    res.status(500).json({ message: 'Rating failed', error: err.message });
  }
};

exports.getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { userId: req.user.userId }
    });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get ratings', error: err.message });
  }
};
