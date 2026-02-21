// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protectAdmin = (req, res, next) => {
    // 1. Check Cookies
    let token = req.cookies.admin_token;

    // 2. FALLBACK: Check Authorization Header (Guaranteed for Mobile)
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1]; // Extract from "Bearer <token>"
    }

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