const prisma = require('./services/db');

async function main() {
    console.log("Seeding test users...");

    // Create Driver
    const driver = await prisma.user.upsert({
        where: { email: 'driver@test.com' },
        update: {},
        create: {
            email: 'driver@test.com',
            name: 'Alice Driver',
            isDriver: true,
            personalityProfile: {
                create: {
                    bio: 'I love driving and listening to rock music.',
                    talkativeness: 5,
                    musicPreference: 'Rock',
                    smokingAllowed: false,
                    petsAllowed: true,
                },
            },
            tripsAsDriver: {
                create: {
                    origin: 'Vancouver',
                    destination: 'Seattle',
                    departureTime: new Date(Date.now() + 86400000), // Tomorrow
                    availableSeats: 3,
                    pricePerSeat: 15.0,
                }
            }
        },
    });

    // Create Passenger
    const passenger = await prisma.user.upsert({
        where: { email: 'rider@test.com' },
        update: {},
        create: {
            email: 'rider@test.com',
            name: 'Bob Rider',
            isDriver: false,
            personalityProfile: {
                create: {
                    bio: 'Just need a quiet ride.',
                    talkativeness: 2,
                    musicPreference: 'Pop',
                    smokingAllowed: false,
                    petsAllowed: false,
                },
            },
        },
    });

    console.log("Seeded:", { driver: driver.id, passenger: passenger.id });
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
