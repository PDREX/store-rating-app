const express = require('express');
const router = express.Router();
const { getAllStores } = require('../controllers/storeController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllStores);

module.exports = router;
