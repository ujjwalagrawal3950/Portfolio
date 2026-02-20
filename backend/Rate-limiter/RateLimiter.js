const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 10 uploads per hour
    message: { message: "Upload quota exceeded. Please try again in an hour." },
    handler: (req, res, next, options) => {
        res.status(429).json(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = uploadLimiter