const express = require('express');
const { bookFlight, getUserBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a booking
router.post('/', protect, bookFlight);

// Get user bookings
router.get('/', protect, getUserBookings);

// Cancel booking
router.delete('/:id', protect, cancelBooking);

module.exports = router;
