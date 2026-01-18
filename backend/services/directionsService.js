const https = require('https');

function getApiKey() {
  return process.env.GOOGLE_MAPS_SERVER_KEY || '';
}

function buildUrl(params) {
  const query = new URLSearchParams(params);
  return `https://maps.googleapis.com/maps/api/directions/json?${query.toString()}`;
}

function fetchDirections(params) {
  const apiKey = getApiKey();
  if (!apiKey) {
    const error = new Error('Missing GOOGLE_MAPS_SERVER_KEY');
    error.code = 'MISSING_API_KEY';
    throw error;
  }

  const url = buildUrl({ ...params, key: apiKey });

  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            const payload = JSON.parse(body);
            if (payload.status !== 'OK' || !payload.routes?.length) {
              const error = new Error(`Directions failed: ${payload.status}`);
              error.code = 'DIRECTIONS_FAILED';
              error.details = payload;
              reject(error);
              return;
            }

            const route = payload.routes[0];
            const leg = route.legs?.[0];
            resolve({
              distanceMeters: leg?.distance?.value || 0,
              durationSeconds: leg?.duration?.value || 0,
              polyline: route.overview_polyline?.points || '',
              summary: route.summary || ''
            });
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

module.exports = {
  fetchDirections
};
