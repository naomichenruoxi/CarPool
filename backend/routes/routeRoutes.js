const express = require('express');
const { fetchDirections } = require('../services/directionsService');

const router = express.Router();

function parseLocation(lat, lng) {
  const latNumber = Number.parseFloat(lat);
  const lngNumber = Number.parseFloat(lng);
  if (!Number.isFinite(latNumber) || !Number.isFinite(lngNumber)) {
    return null;
  }
  return { lat: latNumber, lng: lngNumber };
}

// Get driving distance and polyline
// GET /api/routes/estimate?originLat=...&originLng=...&destLat=...&destLng=...
router.get('/estimate', async (req, res) => {
  const origin = parseLocation(req.query.originLat, req.query.originLng);
  const destination = parseLocation(req.query.destLat, req.query.destLng);

  if (!origin || !destination) {
    return res.status(400).json({ error: 'originLat/originLng and destLat/destLng are required' });
  }

  try {
    const result = await fetchDirections({
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      mode: 'driving'
    });
    res.json(result);
  } catch (error) {
    const status = error.code === 'MISSING_API_KEY' ? 500 : 502;
    res.status(status).json({ error: error.message });
  }
});

module.exports = router;
