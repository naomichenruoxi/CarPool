const axios = require('axios');

const routeService = {
    // --- GOOGLE MAPS IMPLEMENTATION ---

    async getCoordinates(location) {
        if (process.env.GOOGLE_MAPS_API_KEY) {
            try {
                const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                        address: location,
                        key: process.env.GOOGLE_MAPS_API_KEY
                    }
                });
                if (response.data.results.length > 0) {
                    const { lat, lng } = response.data.results[0].geometry.location;
                    return [lat, lng];
                }
            } catch (error) {
                console.error('Google Maps Geocode Error:', error.message);
            }
        }
        // Fallback Mock
        return this.getMockCoordinates(location);
    },

    async getRoute(originCoords, destCoords) {
        if (process.env.GOOGLE_MAPS_API_KEY) {
            // Use Directions API
            try {
                const originStr = `${originCoords[0]},${originCoords[1]}`;
                const destStr = `${destCoords[0]},${destCoords[1]}`;
                const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
                    params: {
                        origin: originStr,
                        destination: destStr,
                        key: process.env.GOOGLE_MAPS_API_KEY
                    }
                });

                if (response.data.routes.length > 0) {
                    const route = response.data.routes[0];
                    const path = [];
                    const legs = route.legs[0];
                    path.push([legs.start_location.lat, legs.start_location.lng]);
                    for (const step of legs.steps) {
                        path.push([step.end_location.lat, step.end_location.lng]);
                    }
                    return path;
                }
            } catch (error) {
                console.error('Google Maps Directions Error:', error.message);
            }
        }
        // Fallback Mock
        return this.interpolatePoints(originCoords, destCoords, 10);
    },

    async getTravelTime(p1, p2) {
        if (process.env.GOOGLE_MAPS_API_KEY) {
            try {
                const originStr = `${p1[0]},${p1[1]}`;
                const destStr = `${p2[0]},${p2[1]}`;
                const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                    params: {
                        origins: originStr,
                        destinations: destStr,
                        key: process.env.GOOGLE_MAPS_API_KEY
                    }
                });

                if (response.data.rows[0].elements[0].status === 'OK') {
                    const durationValue = response.data.rows[0].elements[0].duration.value;
                    return Math.ceil(durationValue / 60); // Seconds to Minutes
                }
            } catch (error) {
                console.error('Google Maps Matrix Error:', error.message);
            }
        }
        // Fallback Haversine
        return this.calculateHaversineTime(p1, p2);
    },

    // --- MOCK HELPERS (Fallback) ---

    getMockCoordinates(location) {
        // Simple hash-based mock coordinates for demo purposes
        const locations = {
            "New York": [40.7128, -74.0060],
            "Boston": [42.3601, -71.0589],
            "Philadelphia": [39.9526, -75.1652],
            "Washington DC": [38.9072, -77.0369],
            "Toronto": [43.651070, -79.347015],
            "Waterloo": [43.4643, -80.5204],
            "Mississauga": [43.5890, -79.6441]
        };

        if (locations[location]) return locations[location];

        // Fallback: Random deterministic coord based on string
        let hash = 0;
        for (let i = 0; i < location.length; i++) hash = location.charCodeAt(i) + ((hash << 5) - hash);
        return [40 + (hash % 100) / 100, -74 + (hash % 100) / 100];
    },

    calculateHaversineTime(p1, p2) {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(p2[0] - p1[0]);
        const dLon = this.deg2rad(p2[1] - p1[1]);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(p1[0])) * Math.cos(this.deg2rad(p2[0])) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        // Assume avg speed 60 km/h -> 1 km = 1 min
        return Math.round(d);
    },

    interpolatePoints(p1, p2, steps) {
        const points = [];
        for (let i = 0; i <= steps; i++) {
            const lat = p1[0] + (p2[0] - p1[0]) * (i / steps);
            const lng = p1[1] + (p2[1] - p1[1]) * (i / steps);
            points.push([lat, lng]);
        }
        return points;
    },

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    },

    // Check if a point is within radius (km) of a route path
    isPointNearRoute(point, routePath, radiusKm = 10) {
        for (const routePoint of routePath) {
            const dist = this.calculateDistance(point, routePoint);
            if (dist <= radiusKm) return true;
        }
        return false;
    },

    calculateDistance(p1, p2) {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(p2[0] - p1[0]);
        const dLon = this.deg2rad(p2[1] - p1[1]);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(p1[0])) * Math.cos(this.deg2rad(p2[0])) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
};

module.exports = routeService;
