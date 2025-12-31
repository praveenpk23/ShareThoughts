import express from "express";
import {
  // registerUser,
  registerStep1,
  registerVerify,
  // handleFinalRegister,
  loginUser,
  logoutUser,
  getUserById,
  getUserProfile,
  updateUserProfile,
  forgotPasswordStep1,
  forgotPasswordStep2,
  checkUsernameAvailability,
  usernameSuggestions
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/getuser", getUserById);
router.get("/profile", protect, getUserProfile);
router.put("/profileUpdate", protect, updateUserProfile);
router.post("/register/step1", registerStep1);  
router.post("/register/verify", registerVerify);
router.post("/forgetpassword/step1",forgotPasswordStep1);
router.post("/forgetpassword/step2",forgotPasswordStep2);
router.get("/check-username",checkUsernameAvailability)
router.get("/username-suggestions", usernameSuggestions)


export default router;
