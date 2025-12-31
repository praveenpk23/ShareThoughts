import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';

// @desc Create post
// @route POST /api/posts
export const createPost = asyncHandler(async (req, res) => {
  if(!req.body.post){
    res.status(400);
    throw new Error('Post content is required');
  }
    const post = await Post.create({
    userId: req.user._id,
    post: req.body.post,
  });
  res.status(201).json(post);
});

// @desc Get posts (all or by userId) with pagination
// @route GET /api/posts/:id
// export const getPosts = asyncHandler(async (req, res) => {
//   const { userId } = req.query;
//   const {id} = req.params;
//   if(id){
//     const post = await Post.findById(id).populate('userId', 'name email username isVerified');
//     if(!post) {
//       res.status(404);
//       throw new Error('Post not found');
//     }
//      return res.json(post);
//   }
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   const filter = userId ? { userId } : {};

//   const posts = await Post.find(filter).populate("userId", "name username isVerified")
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);

//   res.json(posts);
// });

// @desc Get posts sorted by likes (high → low)
// @route GET /api/posts
// export const getPosts = asyncHandler(async (req, res) => {
//   const { userId } = req.query;

//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   const matchStage = userId
//     ? { userId: new mongoose.Types.ObjectId(userId) }
//     : {};

//   const posts = await Post.aggregate([
//     { $match: matchStage },

//     // join likes
//     {
//       $lookup: {
//         from: "likes",               // collection name (plural!)
//         localField: "_id",
//         foreignField: "postId",
//         as: "likes",
//       },
//     },

//     // add likeCount
//     {
//       $addFields: {
//         likeCount: { $size: "$likes" },
//       },
//     },

//     // sort by likes DESC, then latest
//     {
//       $sort: {
//         likeCount: -1,
//         createdAt: -1,
//       },
//     },

//     // pagination
//     { $skip: skip },
//     { $limit: limit },

//     // populate user
//     {
//       $lookup: {
//         from: "users",
//         localField: "userId",
//         foreignField: "_id",
//         as: "userId",
//       },
//     },
//     { $unwind: "$userId" },

//     // clean output
//     {
//       $project: {
//         likes: 0,
//       },
//     },
//   ]);

//   res.json(posts);
// });
export const getPosts = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const matchStage = {};
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    matchStage.userId = new mongoose.Types.ObjectId(userId);
  }

  const posts = await Post.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "postId",
        as: "likes",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$likes" },
      },
    },
    { $sort: { likeCount: -1, createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userId",
      },
    },
    { $unwind: "$userId" },
    { $project: { likes: 0 } },
  ]);

  res.json(posts);
});


// @desc Get all posts by userId
// @route GET /api/posts/user/:id
export const getAllPostsById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const posts = await Post.find({ userId: id }).populate('userId','name email username isVerified' ).sort({ createdAt: -1 });
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
