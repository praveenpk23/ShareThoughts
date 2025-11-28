import express from "express";
import {
  createContent,
  getContents,
  getContentById,
  updateContent,
  deleteContent,
  toggleLike,
  getContentsByCategory,
  getContentsByFor,
  getLikesCount,
  getContentsByEmotion,
} from "../controllers/contentController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public or user feed (auto-filtered/random)
router
  .route("/").get(getContents); 

// Admin-only operations
router.route("/").post(protect, admin, createContent);

// fetch by category
router.get("/category/:category", getContentsByCategory);

// fetch by audience "for"
router.get("/for/:forValue", getContentsByFor);

// fetch by emotion
router.route("/emotion/:emotion").get(getContentsByEmotion);


// fetch by id
router
  .route("/:id")
  .get(getContentById)
  .put(protect, admin, updateContent)
  .delete(protect, admin, deleteContent);

// Like/unlike content
router.post("/like-toggle", protect, toggleLike);
router.get("/count/:contentId", getLikesCount);

export default router;
