const express = require('express');
const router = express.Router();
const prisma = require('../services/db');
const authenticateUser = require('../middleware/auth');

// Create a rating for a user (optionally tied to a trip)
// POST /api/ratings
router.post('/', authenticateUser, async (req, res) => {
  const { ratedUserId, score, comment, tripId } = req.body;
  const normalizedScore = Number.parseInt(score, 10);
  const tripIdNumber = tripId ? Number.parseInt(tripId, 10) : null;

  if (!ratedUserId) {
    return res.status(400).json({ error: 'ratedUserId is required' });
  }
  if (!Number.isFinite(normalizedScore) || normalizedScore < 1 || normalizedScore > 5) {
    return res.status(400).json({ error: 'score must be an integer from 1 to 5' });
  }
  if (ratedUserId === req.user.id) {
    return res.status(400).json({ error: 'Cannot rate yourself' });
  }

  try {
    const rating = await prisma.rating.create({
      data: {
        raterId: req.user.id,
        ratedUserId,
        tripId: Number.isFinite(tripIdNumber) ? tripIdNumber : null,
        score: normalizedScore,
        comment: comment || null
      }
    });
    res.status(201).json(rating);
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(500).json({ error: 'Failed to create rating' });
  }
});

// Get ratings for a specific user
// GET /api/ratings/user/:id
router.get('/user/:id', async (req, res) => {
  const ratedUserId = req.params.id;
  try {
    const ratings = await prisma.rating.findMany({
      where: { ratedUserId },
      include: {
        rater: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Get ratings received by current user
// GET /api/ratings/me
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: { ratedUserId: req.user.id },
      include: {
        rater: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

module.exports = router;
