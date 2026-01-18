const routeService = require('./routeService');

const routeMatrixService = {
    /**
     * Structure of routeMeta:
     * {
     *   waypoints: [ { location: "address or lat,lng", type: "DRIVER_ORIGIN" | "DRIVER_DEST" | "PICKUP" | "DROPOFF" } ],
     *   matrix: [ [0, 10, ...], [10, 0, ...] ] // minutes
     * }
     */

    /**
     * Initialize a fresh route with Driver Origin and Destination
     */
    async initializeRoute(origin, destination, originCoords = null, destCoords = null) {
        // 1. Get Coordinates/Address
        // Use coordinates if available, otherwise string
        const p1 = originCoords || origin;
        const p2 = destCoords || destination;

        const waypoints = [
            { location: p1, type: 'DRIVER_ORIGIN' },
            { location: p2, type: 'DRIVER_DEST' }
        ];

        // 2. Build 2x2 Matrix
        // T[0][0]=0, T[0][1]=Time(O->D)
        // T[1][0]=Time(D->O), T[1][1]=0

        const timeOD = await routeService.getTravelTime(p1, p2);
        const timeDO = await routeService.getTravelTime(p2, p1); // Usually not needed but good for completeness

        const matrix = [
            [0, timeOD || 0],
            [timeDO || 0, 0]
        ];

        return { waypoints, matrix };
    },

    /**
     * Add new points to the existing matrix only (fetching missing times)
     * Does NOT change the route order, just expanding the knowledge base.
     */
    async expandMatrix(existingMeta, newPoints) {
        // deep copy
        const meta = JSON.parse(JSON.stringify(existingMeta));
        const oldLen = meta.waypoints.length;
        const newLen = oldLen + newPoints.length;

        // Add new waypoints
        meta.waypoints.push(...newPoints);

        // Resize matrix: Add rows
        for (let i = 0; i < oldLen; i++) {
            // Expand existing rows with new columns
            for (let j = 0; j < newPoints.length; j++) {
                meta.matrix[i].push(null); // Placeholder
            }
        }

        // Add new rows
        for (let i = 0; i < newPoints.length; i++) {
            meta.matrix.push(new Array(newLen).fill(null));
        }

        // Fill diagonals
        for (let i = 0; i < newLen; i++) meta.matrix[i][i] = 0;

        // Fetch missing times
        // We need:
        // 1. From OLD points TO NEW points
        // 2. From NEW points TO OLD points
        // 3. From NEW points TO NEW points

        // Optimization: Google Distance Matrix can take multiple origins/destinations.
        // But our routeService.getTravelTime is 1-to-1. 
        // For MVP/Hackathon speed, we'll do promise.all using 1-to-1. 
        // In prod, we'd rewrite routeService to do M-to-N batching.

        const promises = [];

        for (let i = 0; i < newLen; i++) {
            for (let j = 0; j < newLen; j++) {
                if (meta.matrix[i][j] !== null) continue; // Already have it

                // Need T[i][j]
                const p1 = meta.waypoints[i].location;
                const p2 = meta.waypoints[j].location;

                promises.push((async () => {
                    const time = await routeService.getTravelTime(p1, p2);
                    meta.matrix[i][j] = time || 0; // fallback 0 if fail
                })());
            }
        }

        await Promise.all(promises);
        return meta;
    },

    /**
     * Run the "Best Insertion Heuristic"
     * @param {Object} meta - The expanded matrix/waypoints (includes current route + new passenger P & D)
     * @param {Array} currentRouteIndices - [0, 1] meaning [DriverOrigin, DriverDest] (indices in waypoints array)
     * @param {Number} pIndex - Index of new Pickup in waypoints/matrix
     * @param {Number} dIndex - Index of new Dropoff in waypoints/matrix
     */
    findBestInsertion(meta, currentRouteIndices, pIndex, dIndex) {
        let bestCost = Infinity;
        let bestRoute = null;

        const N = currentRouteIndices.length;
        const mat = meta.matrix;

        // Current Cost (Baseline)
        let currentCost = 0;
        for (let i = 0; i < N - 1; i++) {
            const u = currentRouteIndices[i];
            const v = currentRouteIndices[i + 1];
            currentCost += mat[u][v];
        }

        // Try inserting P at index i (1 to N, effectively)
        // Can't insert before Origin (0), so i starts at 1
        // Insert P between current[i-1] and current[i]

        // Actually, let's just iterate all possible positions.
        // Array: [A, B, C] (N=3)
        // Slots: ^ A ^ B ^ C ^
        // 0   1   2   3
        // Can't be 0 (before Origin). Can be 1 (between A, B), 2 (between B, C), 3 (after C).
        // But Driver Destination must be last?
        // Requirement: "driver’s destination... must pass through". 
        // Usually, Driver Dest is the FINAL stop. So we can't insert after it.
        // So P can be inserted at indexes 1 to N-1.

        // Wait, "Driver Dest" is just a waypoint. If I pick up someone, I might drop them off BEFORE or AFTER my work. 
        // But usually "Driver's Trip" implies Origin -> ... -> Destination is the end.
        // Let's assume Driver Dest is FIXED FINAL for now, unless "Extension" is allowed.
        // The prompt says "go to pickup ... before corresponding drop-off". 
        // And "valid way to insert ... into list of must-hit points".
        // Let's assume Driver Start (0) and Driver End (Last) are fixed anchors.

        // So insertions valid ONLY between 0 and Last.

        // Modified Route Construction:
        // [Start, ..., End]
        // Insert P somewhere in middle.
        // Insert D somewhere after P, but before End. (Or is dropping off AFTER driver dest allowed? Assume NO for now).

        // currentRouteIndices: [0, 1] (Start, End)
        // Valid P slots: 1 (between 0 and 1) -> [0, P, 1]
        // Valid D slots: after P (index 2) -> [0, P, D, 1]

        // General Algorithm:
        // Let path = [r0, r1, ... rK] (where rK is DriverDest)
        // P can be inserted at index p_pos in [1 ... K].
        //   New path size K+1.
        // D can be inserted at index d_pos in [p_pos+1 ... K+1].

        for (let i = 1; i < N; i++) {
            // Insert P at position i
            // New partial route: S[0...i-1] + P + S[i...N-1]

            for (let j = i + 1; j <= N; j++) {
                // Insert D at position j (relative to the route with P already in it)

                // Construct the candidate path indices
                const candidatePath = [...currentRouteIndices];
                candidatePath.splice(i, 0, pIndex); // Insert P
                candidatePath.splice(j, 0, dIndex); // Insert D (j is valid because array grew by 1)

                // Calculate new cost
                let newCost = 0;
                for (let k = 0; k < candidatePath.length - 1; k++) {
                    const u = candidatePath[k];
                    const v = candidatePath[k + 1];
                    newCost += mat[u][v];
                }

                if (newCost < bestCost) {
                    bestCost = newCost;
                    bestRoute = candidatePath;
                }
            }
        }

        if (!bestRoute) return null; // Should not happen if slots available

        const addedTime = bestCost - currentCost;

        // Also calculate passenger travel time (P -> D in this route)
        // Iterate bestRoute to find distance between P and D
        // Actually we know direct time `mat[pIndex][dIndex]`, but route might be indirect?
        // Passenger doesn't care if we stop for others, just their total time in car.
        // So sum segments from P to D.
        let passengerTime = 0;
        let counting = false;
        for (let k = 0; k < bestRoute.length - 1; k++) {
            if (bestRoute[k] === pIndex) counting = true;
            if (counting) {
                passengerTime += mat[bestRoute[k]][bestRoute[k + 1]];
            }
            if (bestRoute[k + 1] === dIndex) break; // Reached Dropoff
        }

        return {
            cost: bestCost,
            addedTime: addedTime,
            passengerTime: passengerTime,
            routeIndices: bestRoute
        };
    }
};

module.exports = routeMatrixService;
