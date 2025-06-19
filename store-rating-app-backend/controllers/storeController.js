const { Store, Rating, User } = require('../models');

exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        {
          model: Rating,
          attributes: ['rating']
        }
      ]
    });

    const formatted = stores.map(store => {
      const ratings = store.Ratings.map(r => r.rating);
      const average = ratings.length
        ? (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(2)
        : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: average
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stores', error: err.message });
  }
};
