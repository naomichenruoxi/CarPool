const express = require('express');
const router = express.Router();
const prisma = require('../services/db');
const routeService = require('../services/routeService');
const routeMatrixService = require('../services/routeMatrixService');
const { generateMatchExplanation, generateCompatibilitySummary } = require('../services/aiService');
const authenticateUser = require('../middleware/auth');

// Find Matches & Explain them
// POST /api/matches
// Find Matches & Explain them
// POST /api/matches
router.post('/', authenticateUser, async (req, res) => {
    const {
        origin, destination, time, seats = 1,
        originLat, originLng, destinationLat, destinationLng
    } = req.body;
    const MAX_DETOUR_MINUTES = 30; // Threshold

    try {
        // 0. Geocode Passenger Request
        // Use provided coords if available to avoid API calls/errors
        const pCoords = (originLat && originLng) ? [Number(originLat), Number(originLng)] : origin;
        const dCoords = (destinationLat && destinationLng) ? [Number(destinationLat), Number(destinationLng)] : destination;

        // 1. Fetch potential trips
        const trips = await prisma.trip.findMany({
            where: {
                departureTime: { gte: new Date() },
                availableSeats: { gte: parseInt(seats) }
            },
            include: {
                driver: { include: { personalityProfile: true } },
                bookings: { select: { id: true } }
            }
        });

        const candidateRoutes = [];

        for (const trip of trips) {
            if (trip.bookings.length >= 3) continue;

            // --- MATRIX ALGORITHM ---

            console.log(`Processing Trip ${trip.id} (${trip.origin} -> ${trip.destination})`);

            // 1. Get or Init Matrix Cache
            let meta = trip.routeMeta;
            if (!meta || !meta.matrix) {
                console.log('  Initializing Route Meta...');
                // Self-healing: Initialize if missing
                // Use TRIP coordinates if available
                const tOCoords = (trip.originLat && trip.originLng) ? [trip.originLat, trip.originLng] : null;
                const tDCoords = (trip.destinationLat && trip.destinationLng) ? [trip.destinationLat, trip.destinationLng] : null;

                meta = await routeMatrixService.initializeRoute(trip.origin, trip.destination, tOCoords, tDCoords);
                meta.currentRouteIndices = [0, 1]; // [Start, End]
            }

            // 2. Prepare new points
            // Passenger Pickup (P) and Dropoff (D)
            const newPoints = [
                { location: pCoords, type: 'PICKUP' },
                { location: dCoords, type: 'DROPOFF' }
            ];

            // 3. Expand Matrix (In-Memory for Calculation)
            // We verify if P or D are "near" the route first? 
            // The prompt says: "checks to see if... hits any route within a certain radius."
            // We can do a quick Euclidean/Haversine check using lat/lng if we have them.
            // But strict requirement says use Matrix. Let's trust Matrix for Cost.
            // Optimization: If Origin/Dest are thousands of km away, Matrix API call is waste.
            // Let's assume for Hackathon we just check Cost.

            try {
                // 3. Expand Matrix
                console.log('  Expanding Matrix...');
                const expandedMeta = await routeMatrixService.expandMatrix(meta, newPoints);

                // Debug: Check a few values in matrix
                // Last row is Dropoff. 
                const mat = expandedMeta.matrix;
                console.log('  Matrix Size:', mat.length);
                console.log('  Matrix Sample (Last Row):', mat[mat.length - 1]);

                // Indices of new points in expanded matrix
                // expandedMeta.waypoints has [ ...old, P, D ]
                // old length was meta.waypoints.length
                const pIndex = meta.waypoints.length;
                const dIndex = meta.waypoints.length + 1;

                // 4. Run Heuristic
                const currentRouteIndices = meta.currentRouteIndices || [0, 1];

                console.log('  Running FindBestInsertion...');
                const result = routeMatrixService.findBestInsertion(
                    expandedMeta,
                    currentRouteIndices,
                    pIndex,
                    dIndex
                );

                console.log('  Heuristic Result:', result);

                if (result && result.addedTime <= MAX_DETOUR_MINUTES) {
                    // Match Found!
                    console.log('  MATCH FOUND!');
                    candidateRoutes.push({
                        ...trip,
                        // Add calculated metrics for frontend
                        matchMetrics: {
                            addedTime: result.addedTime,
                            passengerTravelTime: result.passengerTime,
                            detour: Math.round(((result.cost - (result.cost - result.addedTime)) / (result.cost - result.addedTime || 1)) * 100),
                            totalDuration: result.cost
                        }
                    });
                } else {
                    console.log(`  No Match: Added Time ${result?.addedTime} > Max ${MAX_DETOUR_MINUTES}`);
                }
            } catch (algoError) {
                console.error(`Skipping trip ${trip.id} due to matrix error:`, algoError);
            }
        }

        console.log(`Found ${candidateRoutes.length} candidates.`);

        // --- STEP 4: Rank Candidates ---
        // "List candidate routes in increasing order of how long it will take for passenger"
        candidateRoutes.sort((a, b) => a.matchMetrics.passengerTravelTime - b.matchMetrics.passengerTravelTime);

        res.json(candidateRoutes);

    } catch (error) {
        console.error('Match Algo Error:', error);
        res.status(500).json({ error: 'Failed to calculate matches' });
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
