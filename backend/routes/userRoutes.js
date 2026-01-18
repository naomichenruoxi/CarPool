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
        res.status(500).json({ error: 'Failed to sync user', details: error.message });
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

// Get Public User Profile (by ID)
router.get('/:id', authenticateUser, async (req, res) => {
    const { id } = req.params;

    // Handle "me" alias
    if (id === 'me') {
        // ... (reuse existing logic or redirect internally, but easier to just copy logic for robustness here)
        // actually let's just let the client call /me directly, this is for other users.
        // But if client calls /users/me, it hits the specific route defined ABOVE this one.
        // Express matches in order. So /me matches first.
        // So this is for uuid IDs.
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
            include: {
                personalityProfile: true,
                _count: {
                    select: {
                        tripsAsDriver: true,
                        ratingsReceived: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return redacted profile
        const publicProfile = {
            id: user.id,
            name: user.name,
            isDriver: user.isDriver,
            personalityProfile: user.personalityProfile,
            tripsCount: user._count.tripsAsDriver,
            ratingCount: user._count.ratingsReceived,
            // Mock rating for now as we don't assume we have real ratings yet
            rating: 5.0
        };

        res.json(publicProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch public profile' });
    }
});

// Update Personality Profile
router.put('/profile', authenticateUser, async (req, res) => {
    const { bio, talkativeness, musicPreference, smokingAllowed, petsAllowed, hometown, workplace, languages } = req.body;

    try {
        // Ensure user exists first (redundant if Auth is good but safe)
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        if (!user) return res.status(404).json({ error: 'User not found' });

        const profile = await prisma.personalityProfile.upsert({
            where: { userId: user.id },
            update: {
                bio, talkativeness, musicPreference, smokingAllowed, petsAllowed,
                hometown, workplace, languages
            },
            create: {
                userId: user.id,
                bio, talkativeness, musicPreference, smokingAllowed, petsAllowed,
                hometown, workplace, languages
            }
        });
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;
