const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateMatchExplanation = async (matchMetrics) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const { detour, overlap, origin, destination, driverName } = matchMetrics;

        const prompt = `
      You are a helpful carpool assistant. Explain why this ride match is good for the passenger in one sentence (max 20 words).
      Be enthusiastic and mention key benefits.
      
      Match Details:
      - Driver: ${driverName}
      - Detour: ${detour}% (Lower is better)
      - Overlap: ${overlap} (High is better)
      - Route: ${origin} to ${destination}
      
      Explanation:
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text.trim();
    } catch (error) {
        console.error('Error generating AI explanation:', error);
        return 'A great match with minimal detour!'; // Fallback
    }
};

module.exports = {
    generateMatchExplanation
};
