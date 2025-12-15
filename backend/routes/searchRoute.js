import express from 'express';
import { searchContents } from '../controllers/searchController.js';

const router = express.Router();

// Search contents with optional filters
router.get("/search", searchContents);
export default router;