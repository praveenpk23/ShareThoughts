import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    words: {
      type: String,
      required: true,
      trim: true,
    },

    ref: {
      book: [
        {
          title: { type: String, trim: true },
          author: { type: String, trim: true },
          link: { type: String, trim: true },
        },
      ],
      Ytube: [
        {
          title: { type: String, trim: true },
          channel: { type: String, trim: true },
          link: { type: String, trim: true },
        },
      ],
      podcast: [
        {
          title: { type: String, trim: true },
          host: { type: String, trim: true },
          link: { type: String, trim: true },
        },
      ],
      article: [
        {
          title: { type: String, trim: true },
          site: { type: String, trim: true },
          link: { type: String, trim: true },
        },
      ],
    },

    category: {
      type: String,
      enum: [
        "Philosophy",
        "Wisdom",
        "Mental Health",
        "Self-Improvement",
        "Productivity",
        "Stoicism",
        "Life",
      ],
      default: "Philosophy",
    },

    keywords: {
      type: [String],
      default: [],
    },

    for: {
      type: [String],
      default: [],
      // Example: ["Entrepreneurs", "Students", "Thinkers"]
    },

    date: {
      type: Date,
      default: Date.now,
    },

    update: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);
export default Content;
