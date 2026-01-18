const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateMatchExplanation = async (matchMetrics) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const { detour, overlap, origin, destination, driverName } = matchMetrics;

        const prompt = `
      You are a helpful Pathr assistant. Explain why this ride match is good for the passenger in one sentence (max 20 words).
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

const generateCompatibilitySummary = async (userA, userB) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const profileA = userA.personalityProfile || {};
        const profileB = userB.personalityProfile || {};

        const prompt = `
      Compare these two carpool users and write a fun, friendly 1-2 sentence summary of why they would get along (or what they might bond over).
      Focus on positive commonalities.
      
      User A (${userA.name}):
      - Bio: ${profileA.bio || 'N/A'}
      - Talkativeness: ${profileA.talkativeness || 3}/5
      - Music: ${profileA.musicPreference || 'Various'}
      - Smoking: ${profileA.smokingAllowed ? 'Yes' : 'No'}
      - Pets: ${profileA.petsAllowed ? 'Yes' : 'No'}

      User B (${userB.name}):
      - Bio: ${profileB.bio || 'N/A'}
      - Talkativeness: ${profileB.talkativeness || 3}/5
      - Music: ${profileB.musicPreference || 'Various'}
      - Smoking: ${profileB.smokingAllowed ? 'Yes' : 'No'}
      - Pets: ${profileB.petsAllowed ? 'Yes' : 'No'}

      Summary (Max 30 words, friendly tone):
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Error generating compatibility summary:', error);
        return 'Two travelers correctly matched!';
    }
};

module.exports = {
    generateMatchExplanation,
    generateCompatibilitySummary
};
