const express = require('express');
const router = express.Router();
const amadeus = require('amadeus');

// Initialize Amadeus client
const amadeusClient = new amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

// This will make sure that socket.io is passed to the routes
module.exports = (io) => {

    router.get('/search', async (req, res) => {
        const { origin, destination, date, passengers } = req.query;

        try {
            const response = await amadeusClient.shopping.flightOffersSearch.get({
                originLocationCode: origin,
                destinationLocationCode: destination,
                departureDate: date,
                adults: passengers || 1,  // default to 1 passenger if not provided
            });

            // Emit real-time update when flight data is fetched
            io.emit('flight-update', {
                message: `✈️ New flights found for ${origin} ➡ ${destination}!`,
                timestamp: new Date()
            });

            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
