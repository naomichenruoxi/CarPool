const express = require('express');
const router = express.Router();
const prisma = require('../services/db');
const authenticateUser = require('../middleware/auth');

// Create a booking for a trip
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

      // Create Booking (PENDING)
      const created = await tx.booking.create({
        data: {
          tripId: tripIdNumber,
          passengerId: req.user.id,
          status: 'PENDING'
        }
      });

      // Create Initial Message if provided
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

// Update Booking Status (Approve/Reject)
// PATCH /api/bookings/:id/status
router.patch('/:id/status', authenticateUser, async (req, res) => {
  const { status } = req.body; // 'APPROVED', 'REJECTED'
  const bookingId = Number(req.params.id);
  console.log(`PATCH Status Update - Raw ID: ${req.params.id}, Parsed: ${bookingId}, Status: ${status}`);

  if (!['APPROVED', 'REJECTED'].includes(status)) {
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

      if (status === 'APPROVED') {
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
        data: { status }
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

      // Only increment seats if they were deducted (APPROVED)
      if (booking.status === 'APPROVED') {
        await tx.trip.update({
          where: { id: booking.tripId },
          data: { availableSeats: { increment: 1 } }
        });
      }

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
