// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protectAdmin = (req, res, next) => {
    // Get token from cookies
    const token = req.cookies.admin_token;

    if (!token) {
        return res.status(401).json({ message: "Authentication required. Access denied." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Session expired. Please log in again." });
    }
};

module.exports = { protectAdmin };