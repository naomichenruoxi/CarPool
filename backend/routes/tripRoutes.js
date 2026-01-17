const express = require('express');
const router = express.Router();
const prisma = require('../services/db');
const authenticateUser = require('../middleware/auth');

// Create a new trip (Driver only)
// POST /api/trips
router.post('/', authenticateUser, async (req, res) => {
    const { origin, destination, departureTime, availableSeats, pricePerSeat } = req.body;

    try {
        // Ideally check if user is a driver
        // const user = await prisma.user.findUnique(...)

        const trip = await prisma.trip.create({
            data: {
                driverId: req.user.id,
                origin,
                destination,
                departureTime: new Date(departureTime),
                availableSeats: parseInt(availableSeats),
                pricePerSeat: parseFloat(pricePerSeat)
            }
        });

        res.status(201).json(trip);
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ error: 'Failed to create trip' });
    }
});

// Search/List trips
// GET /api/trips
router.get('/', async (req, res) => {
    // TODO: Add filters (origin, destination, date)
    try {
        const trips = await prisma.trip.findMany({
            include: {
                driver: {
                    include: { personalityProfile: true } // Include driver vibe
                }
            },
            orderBy: { departureTime: 'asc' }
        });
        res.json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

module.exports = router;
