// import { askPerplexity } from "./../controllers/PerplexityController.js";
// import express from "express";
// const router = express.Router();
// import {protect} from "../middlewares/authMiddleware.js";
// router.post("/ask", protect, askPerplexity);

// export default router;

import express from "express";
import { getUserChats, askPerplexity } from "../controllers/PerplexityController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/ask", protect, askPerplexity);
router.get("/", protect, getUserChats); // paginated
export default router;


