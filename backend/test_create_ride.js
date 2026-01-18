const axios = require('axios');

async function testCreateRide() {
    try {
        const response = await axios.post('http://localhost:3000/api/trips', {
            origin: 'Test Origin',
            destination: 'Test Destination',
            departureTime: new Date(Date.now() + 86400000).toISOString(),
            availableSeats: 3,
            pricePerSeat: 20
        }, {
            headers: {
                Authorization: 'Bearer mock-token-mock-driver-alice'
            }
        });
        console.log('Success:', response.status, response.data);
    } catch (error) {
        console.log('Error:', error.response ? error.response.status : error.message);
        if (error.response) {
            console.log('Data:', error.response.data);
        }
    }
}

testCreateRide();
