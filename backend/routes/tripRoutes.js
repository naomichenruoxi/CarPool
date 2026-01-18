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
    try {
        const { origin, destination, date, time, timeWindowMins } = req.query;
        const filters = {};

        if (origin) {
            filters.origin = { contains: origin, mode: 'insensitive' };
        }
        if (destination) {
            filters.destination = { contains: destination, mode: 'insensitive' };
        }

        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setDate(end.getDate() + 1);
            filters.departureTime = { gte: start, lt: end };
        }

        if (time && timeWindowMins) {
            const center = new Date(time);
            const windowMs = Number.parseInt(timeWindowMins, 10) * 60 * 1000;
            if (Number.isFinite(center.getTime()) && Number.isFinite(windowMs)) {
                const start = new Date(center.getTime() - windowMs);
                const end = new Date(center.getTime() + windowMs);
                filters.departureTime = { gte: start, lte: end };
            }
        }

        const trips = await prisma.trip.findMany({
            where: filters,
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

// Get trip details
// GET /api/trips/:id
router.get('/:id', async (req, res) => {
    const tripId = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(tripId)) {
        return res.status(400).json({ error: 'Invalid trip id' });
    }

    try {
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                driver: { include: { personalityProfile: true } },
                bookings: true
            }
        });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        res.json(trip);
    } catch (error) {
        console.error('Error fetching trip:', error);
        res.status(500).json({ error: 'Failed to fetch trip' });
    }
});

// Update a trip (driver only)
// PUT /api/trips/:id
router.put('/:id', authenticateUser, async (req, res) => {
    const tripId = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(tripId)) {
        return res.status(400).json({ error: 'Invalid trip id' });
    }

    const { origin, destination, departureTime, availableSeats, pricePerSeat } = req.body;
    const data = {};

    if (origin) data.origin = origin;
    if (destination) data.destination = destination;
    if (departureTime) data.departureTime = new Date(departureTime);
    if (availableSeats !== undefined) data.availableSeats = Number.parseInt(availableSeats, 10);
    if (pricePerSeat !== undefined) data.pricePerSeat = Number.parseFloat(pricePerSeat);

    try {
        const trip = await prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        if (trip.driverId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this trip' });
        }

        const updated = await prisma.trip.update({
            where: { id: tripId },
            data
        });
        res.json(updated);
    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ error: 'Failed to update trip' });
    }
});

// Delete a trip (driver only)
// DELETE /api/trips/:id
router.delete('/:id', authenticateUser, async (req, res) => {
    const tripId = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(tripId)) {
        return res.status(400).json({ error: 'Invalid trip id' });
    }

    try {
        const trip = await prisma.trip.findUnique({ where: { id: tripId } });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        if (trip.driverId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this trip' });
        }

        await prisma.trip.delete({ where: { id: tripId } });
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting trip:', error);
        res.status(500).json({ error: 'Failed to delete trip' });
    }
});

module.exports = router;
