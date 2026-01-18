function toRadians(value) {
  return (value * Math.PI) / 180;
}

function haversineDistanceKm(a, b) {
  if (!a || !b) return null;
  if (!Number.isFinite(a.lat) || !Number.isFinite(a.lng)) return null;
  if (!Number.isFinite(b.lat) || !Number.isFinite(b.lng)) return null;

  const earthRadiusKm = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(h));

  return earthRadiusKm * c;
}

function extraDetourKm(driverOrigin, driverDestination, riderOrigin, riderDestination) {
  const base = haversineDistanceKm(driverOrigin, driverDestination);
  const detour =
    haversineDistanceKm(driverOrigin, riderOrigin) +
    haversineDistanceKm(riderOrigin, riderDestination) +
    haversineDistanceKm(riderDestination, driverDestination);

  if (!Number.isFinite(base) || !Number.isFinite(detour)) return null;
  return detour - base;
}

module.exports = {
  haversineDistanceKm,
  extraDetourKm
};
