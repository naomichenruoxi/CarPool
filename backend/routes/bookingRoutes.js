const express = require('express');
const router = express.Router();
const prisma = require('../services/db');
const authenticateUser = require('../middleware/auth');

// Create a booking request (pending approval)
// POST /api/bookings
router.post('/', authenticateUser, async (req, res) => {
  const { tripId, initialMessage } = req.body;
  const tripIdNumber = Number.parseInt(tripId, 10);

  if (!Number.isFinite(tripIdNumber)) {
    return res.status(400).json({ error: 'Invalid tripId' });
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id: tripIdNumber } });
      if (!trip) throw { status: 404, message: 'Trip not found' };

      if (trip.driverId === req.user.id) throw { status: 400, message: 'Driver cannot book own trip' };

      const existing = await tx.booking.findFirst({
        where: { tripId: tripIdNumber, passengerId: req.user.id }
      });
      if (existing) throw { status: 409, message: 'Booking request already exists' };

      const created = await tx.booking.create({
        data: {
          tripId: tripIdNumber,
          passengerId: req.user.id,
          status: 'PENDING'
        }
      });

      // Create Initial Message if provided
      if (initialMessage) {
        console.log("Creating initial message:", initialMessage);
        await tx.message.create({
          data: {
            content: initialMessage,
            senderId: req.user.id,
            bookingId: created.id
          }
        });
        console.log("Initial message created for booking:", created.id);
      } else {
        console.log("No initial message provided");
      }

      // DO NOT decrement seats yet. Only on approval.

      return created;
    });

    res.status(201).json(booking);
  } catch (error) {
    if (error?.status) return res.status(error.status).json({ error: error.message });
    console.error('Error creating booking request:', error);
    res.status(500).json({ error: 'Failed to create booking request' });
  }
});

// Update Booking Status (Accept/Reject)
// PATCH /api/bookings/:id/status
router.patch('/:id/status', authenticateUser, async (req, res) => {
  const { status } = req.body; // 'ACCEPTED', 'REJECTED'
  const bookingId = Number(req.params.id);
  console.log(`PATCH Status Update - Raw ID: ${req.params.id}, Parsed: ${bookingId}, Status: ${status}`);

  if (!['ACCEPTED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { trip: true }
      });

      if (!booking) throw { status: 404, message: 'Booking not found' };

      // Only Driver can update status
      if (booking.trip.driverId !== req.user.id) {
        throw { status: 403, message: 'Not authorized' };
      }

      if (status === 'ACCEPTED') {
        // Check seats again
        const freshTrip = await tx.trip.findUnique({ where: { id: booking.tripId } });
        if (freshTrip.availableSeats <= 0) {
          throw { status: 400, message: 'No seats available to approve' };
        }

        // Decrement seats
        await tx.trip.update({
          where: { id: booking.tripId },
          data: { availableSeats: { decrement: 1 } }
        });
      }

      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: { status, respondedAt: new Date() }
      });

      return updated;
    });

    res.json(result);
  } catch (error) {
    if (error?.status) return res.status(error.status).json({ error: error.message });
    console.error('Status Update Error:', error);
    res.status(500).json({ error: 'Failed to update status' });
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
