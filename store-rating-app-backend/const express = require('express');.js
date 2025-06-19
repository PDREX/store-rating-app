const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Routes
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/store');
const ratingRoutes = require('./routes/rating');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to SQLite database
sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch((err) => console.error('❌ DB connection error:', err));

// Base route
app.get('/', (req, res) => {
  res.send('🟢 Store Rating API is running');
});
app.get('/api', (req, res) => {
  res.send('📡 Welcome to the Store Rating App API');
});

// Register route files
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});

