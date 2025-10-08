import express from "express";
import { protect } from "../middlewares/authMiddleware.js"; // middleware to get logged-in user
import {
  likePost,
  unlikePost,
  getPostLikes,
  getLikedPosts,
} from "../controllers/likeController.js";

const router = express.Router();

// Like a post
router.post("/like", protect, likePost);

// Unlike a post
router.post("/unlike", protect, unlikePost);

// Get likes info for a post
router.get("/:postId/likes", getPostLikes);

// Get all posts liked by the current user
router.get("/my/liked", protect, getLikedPosts);



export default router;






