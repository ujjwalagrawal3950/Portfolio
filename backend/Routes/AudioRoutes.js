const express = require('express');
const https = require('https');
const http = require('http');
const router = express.Router();

// Proxy audio stream to bypass CORS
router.get('/stream', (req, res) => {
    const audioUrl = req.query.url;

    if (!audioUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // Choose http or https based on the URL protocol
        const client = audioUrl.startsWith('https') ? https : http;

        client.get(audioUrl, (proxyRes) => {
            // Forward the content type and appropriate headers
            const contentType = proxyRes.headers['content-type'] || 'audio/mpeg';
            const contentLength = proxyRes.headers['content-length'];

            res.setHeader('Content-Type', contentType);
            if (contentLength) {
                res.setHeader('Content-Length', contentLength);
            }
            res.setHeader('Accept-Ranges', 'bytes');
            // Explicitly allow cross origin access so frontend Canvas can read it
            res.setHeader('Access-Control-Allow-Origin', '*'); 

            // Handle errors
            if (proxyRes.statusCode !== 200 && proxyRes.statusCode !== 206) {
                console.error(`Audio stream failed with status ${proxyRes.statusCode}`);
                return res.status(proxyRes.statusCode).end();
            }

            // Pipe the audio stream directly to the response
            proxyRes.pipe(res);
        }).on('error', (err) => {
            console.error('Error fetching audio:', err.message);
            res.status(500).json({ error: 'Failed to fetch audio stream' });
        });
    } catch (error) {
        console.error('Stream setup error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
