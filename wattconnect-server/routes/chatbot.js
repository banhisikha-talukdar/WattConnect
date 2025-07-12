// routes/chatbot.js
const express = require('express');
const router = express.Router();
require('dotenv').config(); // Ensure dotenv is configured here too, though server.js loads it

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Retrieve API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY;

// IMPORTANT: Check if the API key is loaded
if (!API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is not set in your .env file or environment variables in routes/chatbot.js.");
  // In a production app, you might want to handle this more gracefully,
  // e.g., by throwing an error or preventing the server from starting.
}

// Initialize Google Gemini with your API key
const genAI = new GoogleGenerativeAI(API_KEY);

// POST /api/chatbot
router.post('/', async (req, res) => {
  const { billAmount, userAnswers } = req.body; // Expecting billAmount and userAnswers from frontend

  // Basic input validation
  if (!billAmount) {
    return res.status(400).json({ error: 'Bill amount is required.' });
  }

  // If API_KEY was not found, return an error immediately
  if (!API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: Gemini API key is missing.' });
  }

  try {
    // Use the gemini-2.0-flash model for text generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct the prompt using the received billAmount and additional context
    // You can make this prompt more dynamic based on userAnswers if you expand your chatbot
    const prompt = `My monthly electricity bill is ₹${billAmount}. Give me some personalized and actionable tips to reduce my bill. Assume I live in a household in Guwahati, Assam, India, and consider local climate and common appliance usage. Provide tips in bullet points.`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    if (!aiResponse) {
      return res.status(500).json({ error: 'No response (empty reply) from Gemini API.' });
    }

    // Send back the generated tips
    res.json({ tips: aiResponse.trim() });

  } catch (error) {
    console.error("Gemini API Error:", error.message || error);
    // Provide a more generic error message to the client for security
    res.status(500).json({ error: 'Failed to generate response. Please try again later.' });
  }
});

module.exports = router;
