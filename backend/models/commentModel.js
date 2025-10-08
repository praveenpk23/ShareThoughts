import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  mention: String, // optional: @username
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  reply: [replySchema], // all replies (1 level) with mention
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
