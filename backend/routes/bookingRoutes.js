const express = require('express');
const router = express.Router();
const prisma = require('../services/db');
const authenticateUser = require('../middleware/auth');

// Create a booking for a trip
// POST /api/bookings
router.post('/', authenticateUser, async (req, res) => {
  const { tripId } = req.body;
  const tripIdNumber = Number.parseInt(tripId, 10);

  if (!Number.isFinite(tripIdNumber)) {
    return res.status(400).json({ error: 'Invalid tripId' });
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id: tripIdNumber } });
      if (!trip) {
        const err = new Error('Trip not found');
        err.status = 404;
        throw err;
      }
      if (trip.availableSeats <= 0) {
        const err = new Error('No seats available');
        err.status = 400;
        throw err;
      }
      if (trip.driverId === req.user.id) {
        const err = new Error('Driver cannot book own trip');
        err.status = 400;
        throw err;
      }

      const existing = await tx.booking.findFirst({
        where: { tripId: tripIdNumber, passengerId: req.user.id }
      });
      if (existing) {
        const err = new Error('Booking already exists');
        err.status = 409;
        throw err;
      }

      const created = await tx.booking.create({
        data: {
          tripId: tripIdNumber,
          passengerId: req.user.id
        }
      });

      await tx.trip.update({
        where: { id: tripIdNumber },
        data: { availableSeats: trip.availableSeats - 1 }
      });

      return created;
    });

    res.status(201).json(booking);
  } catch (error) {
    if (error?.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// List bookings for current user
// GET /api/bookings/me
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { passengerId: req.user.id },
      include: {
        trip: {
          include: {
            driver: { include: { personalityProfile: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Cancel a booking
// DELETE /api/bookings/:id
router.delete('/:id', authenticateUser, async (req, res) => {
  const bookingId = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(bookingId)) {
    return res.status(400).json({ error: 'Invalid booking id' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId }
      });

      if (!booking) {
        return { status: 404, error: 'Booking not found' };
      }
      if (booking.passengerId !== req.user.id) {
        return { status: 403, error: 'Not authorized to cancel this booking' };
      }

      await tx.booking.delete({ where: { id: bookingId } });

      await tx.trip.update({
        where: { id: booking.tripId },
        data: { availableSeats: { increment: 1 } }
      });

      return { booking };
    });

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
