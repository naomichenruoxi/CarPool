const prisma = require('./services/db');

async function main() {
    const userId = '2d67afac-a41e-4095-b90f-e4ca55b73212';
    console.log(`Checking for user: ${userId}`);

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (user) {
        console.log('User found:', user);
    } else {
        console.log('User NOT found in database.');
    }

    // Also check trips to see if this ID is referenced
    const trips = await prisma.trip.findMany({
        where: { driverId: userId }
    });
    console.log(`Trips found for this driver: ${trips.length}`);

    // Check all trips to see if any have drivers that don't exist
    const allTrips = await prisma.trip.findMany({
        include: { driver: true }
    });

    const orphanTrips = allTrips.filter(t => !t.driver);
    console.log(`Orphan trips (no driver in DB): ${orphanTrips.length}`);
    if (orphanTrips.length > 0) {
        console.log('Orphan Trip IDs:', orphanTrips.map(t => t.id));
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
