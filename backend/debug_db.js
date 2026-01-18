
const prisma = require('./services/db');

async function debugDB() {
    try {
        console.log("--- USERS ---");
        const users = await prisma.user.findMany();
        console.log(users);

        console.log("\n--- TRIPS ---");
        const trips = await prisma.trip.findMany({
            include: { driver: true }
        });
        console.log(JSON.stringify(trips, null, 2));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

debugDB();
