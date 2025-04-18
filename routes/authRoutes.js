const express = require('express');
const { loginUser, createUser, getUsers } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/register', createUser);

// Protected routes
router.get('/users', protect, getUsers);

module.exports = router;
