import { askPerplexity } from "./../controllers/PerplexityController.js";
import express from "express";
const router = express.Router();

router.post("/ask", askPerplexity);


export default router;