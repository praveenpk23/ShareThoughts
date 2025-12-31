import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profession: {
      type: String,
      enum: [
        "Entrepreneur",
        "Student",
        "Developer",
        "Artist",
        "Thinker",
        "Fitness",
        "Creator",
        "Other",
      ],
      default: "",
    },

    interests: {
      type: [String],
      default: [],
      // Example: ["Philosophy", "Self-Improvement"]
    },

    forPeople: {
      type: [String],
      default: [],
      // Example: ["Entrepreneurs", "Students"]
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    isAdmin:  { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);
const User = mongoose.model('User', userSchema);
export default User;  