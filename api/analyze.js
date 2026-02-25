module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    return res.status(400).json({ error: 'A topic is required.' });
  }

  if (topic.length > 200) {
    return res.status(400).json({ error: 'Topic is too long.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  const prompt = `You are an expert podcast analyst. Your task is to find popular podcasts that have discussed a given topic from OPPOSING or significantly different viewpoints.

For the topic: "${topic.trim()}"

1. Identify real, well-known podcasts that have covered this topic with measurably different stances
2. Analyze their positions based on your knowledge of these podcasts
3. Find the two podcasts with the most clearly contrasting viewpoints

Return a JSON object (and NOTHING else — no markdown, no backticks, no explanation, just raw JSON) in this exact format:
{
  "topic": "the topic",
  "podcast_left": {
    "name": "Podcast Name",
    "episode": "Episode title or description",
    "url": "https://podcast-url.com",
    "hosts": "Host name(s)",
    "stance_label": "One-sentence label for their position",
    "stance_detail": "2-3 sentences explaining their position on the topic",
    "summary": "3-4 sentences summarizing what they argue, their key evidence, and their conclusion"
  },
  "podcast_right": {
    "name": "Podcast Name",
    "episode": "Episode title or description",
    "url": "https://podcast-url.com",
    "hosts": "Host name(s)",
    "stance_label": "One-sentence label for their position",
    "stance_detail": "2-3 sentences explaining their position on the topic",
    "summary": "3-4 sentences summarizing what they argue, their key evidence, and their conclusion"
  },
  "key_differences": [
    {
      "dimension": "Topic dimension (e.g. Economic Impact)",
      "left_view": "What podcast_left argues on this dimension",
      "right_view": "What podcast_right argues on this dimension"
    },
    {
      "dimension": "Another dimension",
      "left_view": "...",
      "right_view": "..."
    },
    {
      "dimension": "Third dimension",
      "left_view": "...",
      "right_view": "..."
    }
  ]
}

Use real, well-known podcasts with significant audiences. Choose podcasts that genuinely have contrasting views — not just slightly different perspectives. The contrast should be meaningful and interesting.`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          }
        })
      }
    );

 if (!geminiRes.ok) {
      const errData = await geminiRes.json();
      console.error('Gemini API error:', errData);
      return res.status(502).json({ error: errData?.error?.message || JSON.stringify(errData) });
    }

    const data = await geminiRes.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!rawText) {
      console.error('Empty Gemini response:', JSON.stringify(data));
      return res.status(500).json({ error: 'Empty response from AI. Please try again.' });
    }

    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('JSON parse error. Raw text:', rawText);
      return res.status(500).json({ error: 'Could not parse AI response. Please try a different topic.' });
    }

    return res.status(200).json(parsed);

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
};
