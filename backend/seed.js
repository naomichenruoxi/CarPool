const prisma = require('./services/db');

async function main() {
    console.log("Seeding test users with dev-mode compatible IDs...");

    // Clear existing data first
    await prisma.message.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.rating.deleteMany();
    await prisma.trip.deleteMany();
    await prisma.personalityProfile.deleteMany();
    await prisma.user.deleteMany();

    // Create Driver (Alice) - matches frontend dev-mode login ID
    const alice = await prisma.user.create({
        data: {
            id: 'mock-driver-alice',  // Must match Login.tsx mockLogin call
            email: 'alice@test.com',
            name: 'Alice Driver',
            isDriver: true,
            personalityProfile: {
                create: {
                    bio: 'I love driving and listening to rock music.',
                    talkativeness: 5,
                    musicPreference: 'Rock',
                    smokingAllowed: false,
                    petsAllowed: true,
                    hometown: 'Seattle',
                    workplace: 'Microsoft',
                    languages: 'English, Spanish',
                },
            },
            tripsAsDriver: {
                create: {
                    origin: 'Vancouver, BC, Canada',
                    destination: 'Seattle, WA, USA',
                    departureTime: new Date(Date.now() + 86400000), // Tomorrow
                    availableSeats: 3,
                    pricePerSeat: 25.0,
                }
            }
        },
    });

    // Create Passenger (Bob) - matches frontend dev-mode login ID
    const bob = await prisma.user.create({
        data: {
            id: 'mock-passenger-bob',  // Must match Login.tsx mockLogin call
            email: 'bob@test.com',
            name: 'Bob Passenger',
            isDriver: false,
            personalityProfile: {
                create: {
                    bio: 'Quiet rider who enjoys podcasts.',
                    talkativeness: 2,
                    musicPreference: 'Podcasts',
                    smokingAllowed: false,
                    petsAllowed: false,
                    hometown: 'Portland',
                    workplace: 'Remote',
                    languages: 'English',
                },
            },
        },
    });

    // Create another driver (Charlie)
    const charlie = await prisma.user.create({
        data: {
            id: 'mock-driver-charlie',
            email: 'charlie@test.com',
            name: 'Charlie Driver',
            isDriver: true,
            personalityProfile: {
                create: {
                    bio: 'Early bird, love road trips!',
                    talkativeness: 4,
                    musicPreference: 'Jazz',
                    smokingAllowed: false,
                    petsAllowed: true,
                },
            },
            tripsAsDriver: {
                create: {
                    origin: 'San Francisco, CA, USA',
                    destination: 'Los Angeles, CA, USA',
                    departureTime: new Date(Date.now() + 172800000), // Day after tomorrow
                    availableSeats: 2,
                    pricePerSeat: 35.0,
                }
            }
        },
    });

    // Create another passenger (David)
    const david = await prisma.user.create({
        data: {
            id: 'mock-passenger-david',
            email: 'david@test.com',
            name: 'David Passenger',
            isDriver: false,
            personalityProfile: {
                create: {
                    bio: 'Night owl, flexible schedule.',
                    talkativeness: 3,
                    musicPreference: 'Indie',
                    smokingAllowed: false,
                    petsAllowed: true,
                },
            },
        },
    });

    console.log("Seeded users:");
    console.log("  - Alice Driver (mock-driver-alice)");
    console.log("  - Bob Passenger (mock-passenger-bob)");
    console.log("  - Charlie Driver (mock-driver-charlie)");
    console.log("  - David Passenger (mock-passenger-david)");
    console.log("\nTrips created:");
    console.log("  - Vancouver -> Seattle (by Alice)");
    console.log("  - San Francisco -> Los Angeles (by Charlie)");
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
