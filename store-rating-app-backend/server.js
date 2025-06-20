// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, Store } = require('./models');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stores', require('./routes/storeRoutes')); // ✅ single clean route
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/', (req, res) => {
  res.send('✅ Store Rating App API is running');
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: '❌ Endpoint not found' });
});

// Global Error
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Seed
async function seedStores() {
  const count = await Store.count();
  if (count === 0) {
    console.log('Seeding stores...');
    await Store.bulkCreate([
      { name: 'Tech Haven', address: '123 Silicon Ave' },
      { name: 'Gadget Galaxy', address: '456 Circuit St' },
      { name: 'Book Nook', address: '789 Paper Rd' },
      { name: 'Fashion Forward', address: '321 Style Blvd' },
    ]);
    console.log('✅ Seed complete');
  }
}

// Start server
sequelize.sync({ force: false }).then(async () => {
  console.log('✅ DB synced');
  await seedStores();
  app.listen(PORT, () => {
    console.log(`✅ Server running: http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ DB sync error:', err);
});
