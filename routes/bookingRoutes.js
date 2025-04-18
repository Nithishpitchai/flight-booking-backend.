const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route for booking a flight
router.post('/book', authMiddleware, bookingController.bookFlight);

// Other routes
router.get('/my-bookings', authMiddleware, bookingController.getUserBookings);
router.delete('/cancel/:id', authMiddleware, bookingController.cancelBooking);

module.exports = router;
