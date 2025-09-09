import express from 'express';
import {
  createPost,
  getPosts,
  getAllPostsById,
  updatePost,
  deletePost,
  adminDeletePost,
} from '../controllers/postController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').put(protect, updatePost).delete(protect, deletePost).get(getPosts);
router.route('posts/:id').get(getAllPostsById);
router.delete('/admin/:id', protect, admin, adminDeletePost);

export default router;
