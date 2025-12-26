
import axios from "axios";
import Chat from "../models/chatModel.js";

/**
 * Ask Perplexity API and save messages in a single chat per user
 */
export const askPerplexity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { prompt, chatId } = req.body; // chatId optional for existing chat
    console.log("Prompt received:", prompt,chatId); // ✅ debug
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // 1️⃣ Send prompt to Perplexity
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
    
    const aiReply = response.data.choices[0]?.message?.content || "No reply";
    console.log("AI Reply:", aiReply); // ✅ debug
    // 2️⃣ Find or create chat
    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId });
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
    } else {
      chat = new Chat({ userId });
    }

    // 3️⃣ Add messages
    chat.messages.push(
      { role: "user", content: prompt },
      { role: "assistant", content: aiReply }
    );

    // Optional: Set title if first message
    if (!chat.title || chat.title === "New Chat") {
      chat.title = prompt.slice(0, 30); // first 30 chars as title
    }

    await chat.save();

    res.json({
      chatId: chat._id,
      messages: chat.messages,
      aiReply,
    });
    console.log("Perplexity response:", response.data); // ✅ debug
  } catch (error) {
    console.error("Perplexity Error:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || "Perplexity API error",
    });
  }
};

/**
 */
// controllers/PerplexityController.js

export const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 4 } = req.query; // default: latest 4 chats
    const skip = (page - 1) * limit;

    const chats = await Chat.find({ userId })
      .select("title updatedAt messages") // you can include messages if needed
      .sort({ updatedAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    // total chats count
    const total = await Chat.countDocuments({ userId });

    res.json({
      chats,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalChats: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};


/**
 * Get full chat by ID
 */
export const getChatById = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  const chat = await Chat.findOne({ _id: chatId, userId });

  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  res.json(chat);
};
