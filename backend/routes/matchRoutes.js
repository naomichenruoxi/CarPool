const express = require('express');
const router = express.Router();
const prisma = require('../services/db');
const { generateMatchExplanation, generateCompatibilitySummary } = require('../services/aiService');
const authenticateUser = require('../middleware/auth');

// Find Matches & Explain them
// POST /api/matches
router.post('/', authenticateUser, async (req, res) => {
    const { origin, destination, time } = req.body;

    try {
        // 1. Fetch all trips (Logic would be spatially aware in real app)
        // For MVP/Hackathon: Get all future trips
        const trips = await prisma.trip.findMany({
            where: {
                departureTime: {
                    gte: new Date()
                }
            },
            include: {
                driver: {
                    include: { personalityProfile: true }
                }
            },
            take: 5 // Limit candidates
        });

        // 2. Score Matches (Mock Logic)
        // In reality, use Maps API to check route deviation.
        // Here, we'll assign random "Detour" and "Overlap" scores for demo.
        const matches = await Promise.all(trips.map(async (trip) => {
            const detour = Math.floor(Math.random() * 15) + 1; // 1-15%
            const overlap = ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)];

            // 3. AI Explanation (Only for the best match or all? let's do top 1)
            // We'll attach it to the object.
            return {
                ...trip,
                matchMetrics: {
                    detour,
                    overlap
                }
            };
        }));

        // Sort by "best" (lowest detour)
        matches.sort((a, b) => a.matchMetrics.detour - b.matchMetrics.detour);

        // 4. Enrich Top Match with AI
        if (matches.length > 0) {
            const bestMatch = matches[0];
            const aiExplanation = await generateMatchExplanation({
                driverName: bestMatch.driver.name || 'The Driver',
                origin: bestMatch.origin,
                destination: bestMatch.destination,
                detour: bestMatch.matchMetrics.detour,
                overlap: bestMatch.matchMetrics.overlap
            });
            bestMatch.aiExplanation = aiExplanation;
        }

        res.json(matches);

    } catch (error) {
        console.error('Match Error:', error);
        res.status(500).json({ error: 'Failed to find matches' });
    }
});

// Check Compatibility
// POST /api/matches/compatibility
router.post('/compatibility', authenticateUser, async (req, res) => {
    const { targetUserId } = req.body;
    const currentUserId = req.user.id;

    try {
        const [currentUser, targetUser] = await Promise.all([
            prisma.user.findUnique({ where: { id: currentUserId }, include: { personalityProfile: true } }),
            prisma.user.findUnique({ where: { id: targetUserId }, include: { personalityProfile: true } })
        ]);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const summary = await generateCompatibilitySummary(currentUser, targetUser);

        res.json({ summary });
    } catch (error) {
        console.error('Compatibility Check Error:', error);
        res.status(500).json({ error: 'Failed to generate compatibility' });
    }
});

module.exports = router;
