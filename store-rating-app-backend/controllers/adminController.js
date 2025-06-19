const { User, Store, Rating } = require('../models');
const bcrypt = require('bcryptjs');

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'User creation failed', error: err.message });
  }
};

exports.addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const newStore = await Store.create({ name, email, address, ownerId });
    res.status(201).json({ message: 'Store created', store: newStore });
  } catch (err) {
    res.status(500).json({ message: 'Store creation failed', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { name, email, role, address } = req.query;
    const where = {};

    if (name) where.name = name;
    if (email) where.email = email;
    if (role) where.role = role;
    if (address) where.address = address;

    const users = await User.findAll({ where });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({ include: [Rating] });

    const formatted = stores.map(store => {
      const ratings = store.Ratings.map(r => r.rating);
      const avgRating = ratings.length
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
        : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avgRating
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stores', error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userCount = await User.count();
    const storeCount = await Store.count();
    const ratingCount = await Rating.count();

    res.json({
      totalUsers: userCount,
      totalStores: storeCount,
      totalRatings: ratingCount
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};
