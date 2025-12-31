import express from "express";
import { protect } from "../middlewares/authMiddleware.js"; // ensures req.user._id
import {
  addComment,
  addReply,
  getCommentsForPost,
} from "../controllers/commentController.js";

const router = express.Router();

// Add a comment
router.post("/", protect, addComment);

// Add a reply to a comment
router.post("/reply", protect, addReply);

// Get all comments for a post
router.get("/:postId", getCommentsForPost);

export default router;
