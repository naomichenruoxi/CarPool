const express = require('express');
const router = express.Router();
const prisma = require('../services/db');
const { extraDetourKm, haversineDistanceKm } = require('../services/distance');
const authenticateUser = require('../middleware/auth');
const routeMatrixService = require('../services/routeMatrixService');

// Create a new trip (Driver only)
// POST /api/trips
router.post('/', authenticateUser, async (req, res) => {
    // ... [destructuring params]
    const {
        origin,
        destination,
        originLat,
        originLng,
        destinationLat,
        destinationLng,
        departureTime,
        availableSeats,
        pricePerSeat
    } = req.body;

    try {
        // Initialize Matrix Cache
        // Pass coordinates if they exist
        const oCoords = (originLat && originLng) ? [Number(originLat), Number(originLng)] : null;
        const dCoords = (destinationLat && destinationLng) ? [Number(destinationLat), Number(destinationLng)] : null;

        const routeMeta = await routeMatrixService.initializeRoute(origin, destination, oCoords, dCoords);
        // Add initial route path (indices 0 -> 1)
        routeMeta.currentRouteIndices = [0, 1];

        const trip = await prisma.trip.create({
            data: {
                driverId: req.user.id,
                origin,
                destination,
                originLat: Number.isFinite(originLat) ? originLat : Number.parseFloat(originLat),
                originLng: Number.isFinite(originLng) ? originLng : Number.parseFloat(originLng),
                destinationLat: Number.isFinite(destinationLat)
                    ? destinationLat
                    : Number.parseFloat(destinationLat),
                destinationLng: Number.isFinite(destinationLng)
                    ? destinationLng
                    : Number.parseFloat(destinationLng),
                departureTime: new Date(departureTime),
                availableSeats: parseInt(availableSeats),
                pricePerSeat: parseFloat(pricePerSeat),
                routeMeta // Save initialized cache
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
        const {
            origin,
            destination,
            date,
            time,
            timeWindowMins,
            riderOriginLat,
            riderOriginLng,
            riderDestinationLat,
            riderDestinationLng,
            detourKm
        } = req.query;
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

        if (time) {
            const center = new Date(time);
            const minutes = Number.isFinite(Number.parseInt(timeWindowMins, 10))
                ? Number.parseInt(timeWindowMins, 10)
                : 120;
            const windowMs = minutes * 60 * 1000;
            if (Number.isFinite(center.getTime()) && Number.isFinite(windowMs)) {
                const start = new Date(center.getTime() - windowMs);
                const end = new Date(center.getTime() + windowMs);
                filters.departureTime = { gte: start, lte: end };
            }
        }

        let trips = await prisma.trip.findMany({
            where: filters,
            include: {
                driver: {
                    include: { personalityProfile: true } // Include driver vibe
                }
            },
            orderBy: { departureTime: 'asc' }
        });

        const riderOrigin = {
            lat: Number.parseFloat(riderOriginLat),
            lng: Number.parseFloat(riderOriginLng)
        };
        const riderDestination = {
            lat: Number.parseFloat(riderDestinationLat),
            lng: Number.parseFloat(riderDestinationLng)
        };
        const detourLimit = Number.parseFloat(detourKm);

        let riderDistanceKm = null;
        if (
            Number.isFinite(riderOrigin.lat) &&
            Number.isFinite(riderOrigin.lng) &&
            Number.isFinite(riderDestination.lat) &&
            Number.isFinite(riderDestination.lng)
        ) {
            const threshold = Number.isFinite(detourLimit) ? detourLimit : 3;
            riderDistanceKm = haversineDistanceKm(riderOrigin, riderDestination);

            trips = trips.filter((trip) => {
                if (
                    !Number.isFinite(trip.originLat) ||
                    !Number.isFinite(trip.originLng) ||
                    !Number.isFinite(trip.destinationLat) ||
                    !Number.isFinite(trip.destinationLng)
                ) {
                    return false;
                }

                const extraKm = extraDetourKm(
                    { lat: trip.originLat, lng: trip.originLng },
                    { lat: trip.destinationLat, lng: trip.destinationLng },
                    riderOrigin,
                    riderDestination
                );

                return Number.isFinite(extraKm) && extraKm <= threshold;
            });
        }
        if (Number.isFinite(riderDistanceKm)) {
            const ratePerKm = 0.5;
            trips = trips.map((trip) => {
                const extraKm = extraDetourKm(
                    { lat: trip.originLat, lng: trip.originLng },
                    { lat: trip.destinationLat, lng: trip.destinationLng },
                    riderOrigin,
                    riderDestination
                );
                if (!Number.isFinite(extraKm)) {
                    return trip;
                }
                const priceCad = (riderDistanceKm + extraKm) * ratePerKm;
                return { ...trip, estimatedPriceCad: Number(priceCad.toFixed(2)) };
            });
        }
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

    const {
        origin,
        destination,
        originLat,
        originLng,
        destinationLat,
        destinationLng,
        departureTime,
        availableSeats,
        pricePerSeat
    } = req.body;
    const data = {};

    if (origin) data.origin = origin;
    if (destination) data.destination = destination;
    if (originLat !== undefined) {
        data.originLat = Number.isFinite(originLat) ? originLat : Number.parseFloat(originLat);
    }
    if (originLng !== undefined) {
        data.originLng = Number.isFinite(originLng) ? originLng : Number.parseFloat(originLng);
    }
    if (destinationLat !== undefined) {
        data.destinationLat = Number.isFinite(destinationLat)
            ? destinationLat
            : Number.parseFloat(destinationLat);
    }
    if (destinationLng !== undefined) {
        data.destinationLng = Number.isFinite(destinationLng)
            ? destinationLng
            : Number.parseFloat(destinationLng);
    }
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
