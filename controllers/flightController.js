const axios = require('axios');

exports.searchFlights = async (req, res) => {
    const { origin, destination } = req.query;

    try {
        const response = await axios.get(`http://api.aviationstack.com/v1/flights`, {
            params: {
                access_key: process.env.AVIATIONSTACK_KEY,
                dep_iata: origin,
                arr_iata: destination
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
