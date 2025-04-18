const express = require('express');
const { getUsers, createUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware'); // Ensure correct import path
const router = express.Router();

// Example route using protect middleware
router.get('/', protect, getUsers); // Protect route for authenticated users only

router.post('/', createUser); // Public route for creating a user

module.exports = router;
