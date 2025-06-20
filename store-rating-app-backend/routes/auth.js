const express = require('express');
const router = express.Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET = process.env.JWT_SECRET || 'your_fallback_secret';
const VALID_ROLES = ['user', 'admin', 'store_owner'];

router.post('/register', async (req, res) => {
  try {
    let { name, email, address, password, role = 'user' } = req.body;

    name = name?.trim();
    email = email?.trim();
    role = role.toLowerCase();

    if (!VALID_ROLES.includes(role)) return res.status(400).json({ message: 'Invalid role' });
    if (!name || name.length < 3 || name.length > 60) return res.status(400).json({ message: 'Name length error' });
    if (!email || !email.includes('@')) return res.status(400).json({ message: 'Invalid email' });
    if (!password || password.length < 8) return res.status(400).json({ message: 'Password too short' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password: hashedPassword, role });

    res.status(201).json({
      message: 'User registered',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
