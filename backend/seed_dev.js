const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Alice Driver
    const alice = await prisma.user.upsert({
        where: { email: 'alice@driver.com' },
        update: {},
        create: {
            id: 'mock-driver-alice',
            email: 'alice@driver.com',
            name: 'Alice Driver',
            isDriver: true,
            personalityProfile: {
                create: {
                    bio: "I love driving and coffee!",
                    talkativeness: 5,
                    musicPreference: "Pop Hits",
                    smokingAllowed: false,
                    petsAllowed: true,
                    hometown: "Seattle",
                    workplace: "Tech Corp",
                    languages: "English, Spanish"
                }
            }
        },
    });

    // Bob Passenger
    const bob = await prisma.user.upsert({
        where: { email: 'bob@passenger.com' },
        update: {},
        create: {
            id: 'mock-passenger-bob',
            email: 'bob@passenger.com',
            name: 'Bob Passenger',
            isDriver: false,
        },
    });

    // Charlie Driver
    const charlie = await prisma.user.upsert({
        where: { email: 'charlie@driver.com' },
        update: {},
        create: {
            id: 'mock-driver-charlie',
            email: 'charlie@driver.com',
            name: 'Charlie Driver',
            isDriver: true,
            personalityProfile: {
                create: {
                    bio: "Mountain roads are the best.",
                    talkativeness: 2,
                    musicPreference: "Techno",
                    smokingAllowed: false,
                    petsAllowed: false,
                    hometown: "Portland",
                    workplace: "Freelance",
                    languages: "English"
                }
            }
        },
    });

    // David Passenger
    const david = await prisma.user.upsert({
        where: { email: 'david@passenger.com' },
        update: {},
        create: {
            id: 'mock-passenger-david',
            email: 'david@passenger.com',
            name: 'David Passenger',
            isDriver: false,
        },
    });

    console.log({ alice, bob, charlie, david });

    // Create a trip for Alice
    const tripAlice = await prisma.trip.create({
        data: {
            driverId: alice.id,
            origin: 'San Francisco',
            destination: 'San Jose',
            departureTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
            availableSeats: 3,
            pricePerSeat: 15.0,
            bookings: {}
        }
    });

    // Create a trip for Charlie
    const tripCharlie = await prisma.trip.create({
        data: {
            driverId: charlie.id,
            origin: 'Seattle',
            destination: 'Portland',
            departureTime: new Date(new Date().getTime() + 48 * 60 * 60 * 1000), // Day after tomorrow
            availableSeats: 2,
            pricePerSeat: 25.0,
            bookings: {}
        }
    });

    console.log("Created trips:", { alice: tripAlice, charlie: tripCharlie });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
