const express = require('express');
const router = express.Router();
const { User, Store, Rating } = require('../models');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const bcrypt = require('bcrypt');

// ✅ Apply auth middleware to all routes in this file
router.use(auth);

// ✅ Admin-only dashboard
router.get('/dashboard', role('admin'), async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: err.message });
  }
});

// ✅ Get all users with optional filters
router.get('/users', role('admin'), async (req, res) => {
  try {
    const { name, role: roleFilter } = req.query;
    const where = {};
    if (name) where.name = name;
    if (roleFilter) where.role = roleFilter;

    const users = await User.findAll({ where });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// ✅ Create new user (admin creates new users)
router.post('/users', role('admin'), async (req, res) => {
  try {
    const { name, email, address, password, role: userRole } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role: userRole || 'User'
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create user', error: err.message });
  }
});

// ✅ Get store list with average ratings
router.get('/stores', role('admin'), async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [{ model: Rating, attributes: [] }],
      attributes: {
        include: [
          [Rating.sequelize.fn('AVG', Rating.sequelize.col('ratings.rating')), 'avgRating']
        ]
      },
      group: ['Store.id']
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stores', error: err.message });
  }
});

// ✅ Store owner dashboard to view ratings (optional route)
router.get('/my-store', role('store_owner'), async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { userId: req.user.id },
      include: [{ model: Rating }]
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found for this owner' });
    }

    const ratings = await Rating.findAll({ where: { storeId: store.id } });
    const average = ratings.length
      ? ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length
      : 0;

    res.json({ store, ratings, averageRating: average.toFixed(2) });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching store data', error: err.message });
  }
});

module.exports = router;
