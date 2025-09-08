import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';

// @desc Create post
// @route POST /api/posts
export const createPost = asyncHandler(async (req, res) => {
  const post = await Post.create({
    userId: req.user._id,
    post: req.body.post,
  });
  res.status(201).json(post);
});

// @desc Get posts (all or by userId) with pagination
// @route GET /api/posts
export const getPosts = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = userId ? { userId } : {};

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json(posts);
});

// @desc Update post
// @route PUT /api/posts/:id
export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this post');
  }
  post.post = req.body.post || post.post;
  post.isUpdated = true;
  await post.save();
  res.json(post);
});

// @desc Delete own post
// @route DELETE /api/posts/:id
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this post');
  }
  await post.deleteOne();
  res.json({ message: 'Post deleted' });
});

// @desc Admin delete any post
// @route DELETE /api/posts/admin/:id
export const adminDeletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  await post.deleteOne();
  res.json({ message: 'Post deleted by admin' });
});
