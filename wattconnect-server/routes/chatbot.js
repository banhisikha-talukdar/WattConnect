const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.post('/', async (req, res) => {
  const { billAmount, userAnswers } = req.body;

  if (!billAmount || !userAnswers) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `
You are an energy conservation assistant.

The user's electricity bill this month is ₹${billAmount}.
Here are their answers to follow-up questions: ${userAnswers}

Give 3 personalized, actionable tips to help reduce electricity usage.
Estimate how much money (in ₹) they could save monthly with each tip.
Use a helpful and friendly tone.
`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const tips = completion.data.choices[0].message.content;
    res.json({ tips });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to generate tips' });
  }
});

module.exports = router;
