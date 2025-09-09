import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/getuser", protect, getUserById);

export default router;
