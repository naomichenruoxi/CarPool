const express = require('express');
const router = express.Router();
const prisma = require('../services/db');
const authenticateUser = require('../middleware/auth');

// Sync/Create User in our DB after Supabase Signup
// POST /api/users/sync
router.post('/sync', authenticateUser, async (req, res) => {
    const { email, id } = req.user; // 'id' from Supabase Token is UUID
    const { name, isDriver } = req.body;

    try {
        // Upsert user using the Supabase UUID as our primary key
        const user = await prisma.user.upsert({
            where: { id: id },
            update: {
                email: email, // Update email if it changed in Supabase
                name: name,
                isDriver: isDriver
            },
            create: {
                id: id, // Explicitly set ID
                email: email,
                name: name,
                isDriver: isDriver || false
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ error: 'Failed to sync user' });
    }
});

// Get Current User Profile
router.get('/me', authenticateUser, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { personalityProfile: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found in app db. Please call /sync first.' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update Personality Profile
router.put('/profile', authenticateUser, async (req, res) => {
    const { bio, talkativeness, musicPreference, smokingAllowed, petsAllowed } = req.body;

    try {
        // Ensure user exists first (redundant if Auth is good but safe)
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        if (!user) return res.status(404).json({ error: 'User not found' });

        const profile = await prisma.personalityProfile.upsert({
            where: { userId: user.id },
            update: {
                bio, talkativeness, musicPreference, smokingAllowed, petsAllowed
            },
            create: {
                userId: user.id,
                bio, talkativeness, musicPreference, smokingAllowed, petsAllowed
            }
        });
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;
