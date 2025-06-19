const express = require('express');
const router = express.Router();

const {
  addUser,
  addStore,
  getAllUsers,
  getAllStores,
  getStats
} = require('../controllers/adminController');

const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Protect all admin routes with token + admin role
router.use(verifyToken, requireRole(['admin']));

router.post('/users', addUser);      // POST /api/admin/users
router.post('/stores', addStore);    // POST /api/admin/stores
router.get('/users', getAllUsers);   // GET /api/admin/users
router.get('/stores', getAllStores); // GET /api/admin/stores
router.get('/stats', getStats);      // GET /api/admin/stats

module.exports = router;
