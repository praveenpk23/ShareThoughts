// models/otpModel.js
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  data: { type: Object, required: true }, // temporarily store user data
  expiresAt: { type: Date, required: true },
});

export default mongoose.model("Otp", otpSchema);
