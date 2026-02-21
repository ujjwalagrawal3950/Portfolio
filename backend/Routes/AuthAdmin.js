const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login Route
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Identity Check
        if (username !== process.env.ADMIN_USERNAME) {
            return res.status(401).json({ message: "Invalid Identity Signature" });
        }

        // 2. BCRYPT USAGE: Compare plain text password vs hashed password in .env
        const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Access Key Incorrect" });
        }

        // 3. JWT USAGE: Create the digital "Pass"
        const token = jwt.sign(
            { role: 'admin' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // 4. COOKIE USAGE: Hand the "Pass" to the browser
        // FORCE SameSite=none and Secure=true for Cross-Domain Mobile Support
        // Even in local dev, this is safer for modern browser testing
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: true,               // MUST be true for sameSite: 'none'
            sameSite: 'none',           // REQUIRED for Vercel -> Render cross-domain
            maxAge: 24 * 60 * 60 * 1000 
        });

        // Set a non-httpOnly cookie/hint for the frontend
        res.cookie('is_admin', 'true', {
            httpOnly: false,
            secure: true,               // MUST be true for sameSite: 'none'
            sameSite: 'none',           // REQUIRED for Vercel -> Render cross-domain
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ 
            message: "Access Granted",
            success: true,
            token: token // This is the key for the "Guaranteed" solution
        });

    } catch (error) {
        res.status(500).json({ message: "Auth System Error" });
    }
});

router.get('/admin/verify', (req, res) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ authenticated: false });

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ authenticated: true });
    } catch (err) {
        res.status(401).json({ authenticated: false });
    }
});

module.exports = router;