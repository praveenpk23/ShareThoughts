import axios from "axios";

export const askPerplexity = async (req, res) => {
  try {
    console.log("Prompt received:", req.body); // ✅ debug

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-pro",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Perplexity Error:", error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || "Perplexity API error",
    });
  }
};
