const express = require('express');
const router = express.Router();
const prisma = require('../services/db');
const authenticateUser = require('../middleware/auth');

// Create a booking request (pending approval)
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

      return tx.booking.create({
        data: {
          tripId: tripIdNumber,
          passengerId: req.user.id,
          status: 'PENDING'
        }
      });
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

// List booking requests for trips owned by current driver
// GET /api/bookings/driver
router.get('/driver', authenticateUser, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        trip: { driverId: req.user.id }
      },
      include: {
        trip: true,
        passenger: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching driver bookings:', error);
    res.status(500).json({ error: 'Failed to fetch driver bookings' });
  }
});

// Accept a booking request (driver only)
// POST /api/bookings/:id/accept
router.post('/:id/accept', authenticateUser, async (req, res) => {
  const bookingId = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(bookingId)) {
    return res.status(400).json({ error: 'Invalid booking id' });
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const existing = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { trip: true }
      });
      if (!existing) {
        const err = new Error('Booking not found');
        err.status = 404;
        throw err;
      }
      if (existing.trip.driverId !== req.user.id) {
        const err = new Error('Not authorized to accept this booking');
        err.status = 403;
        throw err;
      }
      if (existing.status !== 'PENDING') {
        const err = new Error('Booking is not pending');
        err.status = 400;
        throw err;
      }
      if (existing.trip.availableSeats <= 0) {
        const err = new Error('No seats available');
        err.status = 400;
        throw err;
      }

      await tx.trip.update({
        where: { id: existing.tripId },
        data: { availableSeats: existing.trip.availableSeats - 1 }
      });

      return tx.booking.update({
        where: { id: bookingId },
        data: { status: 'ACCEPTED', respondedAt: new Date() }
      });
    });

    res.json(booking);
  } catch (error) {
    if (error?.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Error accepting booking:', error);
    res.status(500).json({ error: 'Failed to accept booking' });
  }
});

// Reject a booking request (driver only)
// POST /api/bookings/:id/reject
router.post('/:id/reject', authenticateUser, async (req, res) => {
  const bookingId = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(bookingId)) {
    return res.status(400).json({ error: 'Invalid booking id' });
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const existing = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { trip: true }
      });
      if (!existing) {
        const err = new Error('Booking not found');
        err.status = 404;
        throw err;
      }
      if (existing.trip.driverId !== req.user.id) {
        const err = new Error('Not authorized to reject this booking');
        err.status = 403;
        throw err;
      }
      if (existing.status !== 'PENDING') {
        const err = new Error('Booking is not pending');
        err.status = 400;
        throw err;
      }

      return tx.booking.update({
        where: { id: bookingId },
        data: { status: 'REJECTED', respondedAt: new Date() }
      });
    });

    res.json(booking);
  } catch (error) {
    if (error?.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Error rejecting booking:', error);
    res.status(500).json({ error: 'Failed to reject booking' });
  }
});

// Cancel a booking (passenger only)
// DELETE /api/bookings/:id
router.delete('/:id', authenticateUser, async (req, res) => {
  const bookingId = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(bookingId)) {
    return res.status(400).json({ error: 'Invalid booking id' });
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const existing = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { trip: true }
      });

      if (!existing) {
        const err = new Error('Booking not found');
        err.status = 404;
        throw err;
      }
      if (existing.passengerId !== req.user.id) {
        const err = new Error('Not authorized to cancel this booking');
        err.status = 403;
        throw err;
      }
      if (existing.status === 'CANCELED') {
        const err = new Error('Booking already canceled');
        err.status = 400;
        throw err;
      }

      if (existing.status === 'ACCEPTED') {
        await tx.trip.update({
          where: { id: existing.tripId },
          data: { availableSeats: { increment: 1 } }
        });
      }

      return tx.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELED', respondedAt: new Date() }
      });
    });

    res.json(booking);
  } catch (error) {
    if (error?.status) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Error canceling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
