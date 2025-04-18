const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const User = require('../models/User');
const { sendBookingConfirmation, sendCancellationEmail } = require('../utils/emailService'); // ✅ import both email utils

// Book a flight
exports.bookFlight = async (req, res) => {
    const { flightId, passengers, totalPrice } = req.body;
    const userId = req.user.userId;

    try {
        const flight = await Flight.findById(flightId);
        if (!flight) return res.status(404).json({ error: 'Flight not found' });

        if (flight.seats < passengers.length) {
            return res.status(400).json({ error: 'Not enough seats available' });
        }

        // Reserve seats
        flight.seats -= passengers.length;
        await flight.save();

        const booking = new Booking({
            user: userId,
            flight: flightId,
            passengers,
            totalPrice
        });

        await booking.save();
        await booking.populate('flight'); // ✅ populate flight details for email

        const user = await User.findById(userId); // ✅ get user email
        if (user?.email) {
            await sendBookingConfirmation(user.email, booking); // ✅ send confirmation email
        }

        res.status(201).json({ message: 'Flight booked successfully', booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.userId }).populate('flight');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findById(id).populate('flight');
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        const flight = booking.flight;
        if (flight) {
            flight.seats += booking.passengers.length;
            await flight.save();
        }

        const user = await User.findById(req.user.userId); // ✅ get user

        await booking.remove();

        // ✅ send cancellation email
        if (user?.email) {
            await sendCancellationEmail(user.email, booking);
        }

        res.status(200).json({ message: 'Booking cancelled successfully, email sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
