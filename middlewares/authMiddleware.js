const jwt = require('jsonwebtoken');

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
    let token;

    // Check if token is provided in the Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from the header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user info to the request
            req.user = decoded;

            return next(); // All good, proceed to the route
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If token was not provided
    return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = authMiddleware;
