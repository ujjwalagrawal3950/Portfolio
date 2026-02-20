const express = require('express');

const cloudinary = require('cloudinary').v2;
const router = express.Router();
const User = require('../model/User');
const { upload } = require('../config/cloundinary');
const uploadLimiter = require('../Rate-limiter/RateLimiter');
const { protectAdmin } = require('../middleware/authentication');


// Public: Submit Node
// Public: Submit Node with Rate Limiting and Validation
router.post('/connect', uploadLimiter, upload.single('image'), async (req, res) => {
    try {
        // 1. Validation: Image presence
        if (!req.file) {
            return res.status(400).json({ message: "No node asset detected. Please upload a photo!" });
        }

        // 2. Validation: Name presence & length
        const name = req.body.name?.trim();
        if (!name) {
            return res.status(400).json({ message: "Identity signature required. Please provide a name." });
        }

        if (name.length > 50) {
            return res.status(400).json({ message: "Name is too long. Max 50 characters." });
        }

        // 3. Create User in Database
        const newUser = new User({ 
            name: name, 
            imageUrl: req.file.path // This is the Cloudinary URL from Multer-Storage-Cloudinary
        });
        
        await newUser.save();

        // 4. Success Response
        return res.status(201).json({ 
            message: "Signal Transmitted",
            nodeId: newUser._id 
        });
        
    } catch (error) {
        // CRITICAL: If DB fails but image was uploaded to Cloudinary, 
        // normally you'd want to delete the orphaned image here.
        console.error("Orbit Transmission Error:", error);
        
        return res.status(500).json({ 
            message: "Orbit link failed. System encountered a database collision." 
        });
    }
});

// Public: Get Approved
router.get('/users', async (req, res) => {
    const users = await User.find({ status: 'approved' });
    res.json(users);
});

// Admin: Get Pending
router.get('/admin/pending', protectAdmin, async (req, res) => {
    const pending = await User.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(pending);
});

// Admin: Approve/Reject
router.patch('/admin/approve/:id', protectAdmin, async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { status: 'approved' });
    res.json({ message: "Node activated" });
});

router.delete('/admin/reject/:id', protectAdmin, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Node purged" });
});

// Admin: Delete user by ID
router.delete('/admin/user/:id', protectAdmin, async (req, res) => {
    try {
        const userId = req.params.id;

        // STEP 1: Get the user's data from the Database first
        // We need this to find the image URL before we delete the user
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User does not exist." });
        }

        // STEP 2: Extract the "Public ID" from the URL
        // Cloudinary needs the 'public_id' (filename), not the whole URL, to delete it.
        // If URL is: ".../v12345/my_folder/photo_123.jpg"
        const imageUrl = user.imageUrl;
        
        // This regex logic is cleaner: it gets everything between the last '/' and the '.' 
        const publicId = imageUrl.split('/').pop().split('.')[0];

        // STEP 3: Tell Cloudinary to delete the image
        await cloudinary.uploader.destroy(publicId);

        // STEP 4: Delete the user record from your Database
        await User.findByIdAndDelete(userId);

        // Success!
        res.json({ message: "User and their image have been deleted." });

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: "Something went wrong while deleting." });
    }
});

module.exports = router;