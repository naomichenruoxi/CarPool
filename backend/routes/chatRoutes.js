const express = require('express');
const router = express.Router();
const prisma = require('../services/db');
const authenticateUser = require('../middleware/auth');

// Get all conversations (bookings) for the user
// GET /api/chat/conversations
router.get('/conversations', authenticateUser, async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                OR: [
                    { passengerId: req.user.id },
                    { trip: { driverId: req.user.id } }
                ]
            },
            include: {
                trip: {
                    include: {
                        driver: { select: { id: true, name: true, email: true } }
                    }
                },
                passenger: { select: { id: true, name: true, email: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        console.log(`GET /conversations for user ${req.user.id}: Found ${bookings.length}`);
        res.json(bookings);
    } catch (error) {
        console.error('Get Conversations Error:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

// Send a message
// POST /api/chat/messages
router.post('/messages', authenticateUser, async (req, res) => {
    const { bookingId, content } = req.body;

    if (!content || !bookingId) {
        return res.status(400).json({ error: 'Missing bookingId or content' });
    }

    try {
        // Verify user is part of the booking
        const booking = await prisma.booking.findUnique({
            where: { id: Number(bookingId) },
            include: { trip: true }
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Allow Passenger OR Driver
        if (booking.passengerId !== req.user.id && booking.trip.driverId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId: req.user.id,
                bookingId: Number(bookingId)
            },
            include: {
                sender: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        res.status(201).json(message);
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Get messages for a booking
// GET /api/chat/booking/:bookingId
router.get('/booking/:bookingId', authenticateUser, async (req, res) => {
    const bookingId = Number(req.params.bookingId);

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { trip: true }
        });

        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        if (booking.passengerId !== req.user.id && booking.trip.driverId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const messages = await prisma.message.findMany({
            where: { bookingId },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: { id: true, name: true }
                }
            }
        });

        res.json(messages);
    } catch (error) {
        console.error('Get Messages Error:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router;
