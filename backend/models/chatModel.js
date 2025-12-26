import mongoose from "mongoose";

/**
 * Each message inside a single chat
 */
const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    _id: false, // ✅ messages don't need separate _id
  }
);

/**
 * One document = one chat
 * All messages stored inside this document
 */
const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },

    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 Helpful indexes
chatSchema.index({ userId: 1, updatedAt: -1 });

export default mongoose.model("Chat", chatSchema);
