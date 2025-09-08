import express from 'express';
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  adminDeletePost,
} from '../controllers/postController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').put(protect, updatePost).delete(protect, deletePost);
router.delete('/admin/:id', protect, admin, adminDeletePost);

export default router;
