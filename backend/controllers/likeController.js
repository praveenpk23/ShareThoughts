import Like from '../models/likesModel.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

//   like a post    
export const likePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user._id;

  // Prevent duplicate likes
  const existingLike = await Like.findOne({ postId, userId });
  if (existingLike) return res.status(400).json({ message: "Already liked" });

  const like = await Like.create({ postId, userId });
  res.status(201).json({ message: "Post liked", like });
};

// Unlike a post
export const unlikePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user._id;

  const deleted = await Like.findOneAndDelete({ postId, userId });
  if (!deleted) return res.status(400).json({ message: "You have not liked this post" });

  res.json({ message: "Post unliked" });
};

// no of likes and current user liked or not
export const getPostLikes = async (req, res) => {
  const { postId } = req.params;
  // const userId = async ()=>{
  //   const token = req.cookies.jwt
  //   if(token){
  //     const decoded = jwt.verify(re,process.env.JWT_SECRET) 
  //     return decoded.userId 
  //   }
  //   else{
  //     return null
  //   }
  // }
  let userId = null
  if(req.cookies.jwt){
    try{
      const decoded = jwt.verify(req.cookies.jwt,process.env.JWT_SECRET) 
      userId = decoded.userId
    }catch(e){
      userId = null
    }
  }

  // Total likes
  const totalLikes = await Like.countDocuments({ postId });

  // Whether the user liked
  const userLiked = userId ? await Like.exists({ postId, userId}) : false;

  res.json({ postId, totalLikes, userLiked: !!userLiked });
};

// Get all liked posts by the user
export const getLikedPosts = async (req, res) => {
  const userId = req.user._id;

  const likes = await Like.find({ userId }).select("postId -_id");
  const likedPostIds = likes.map(like => like.postId);

  res.json({ likedPostIds });
};
   
// Get all likes for a specific post
export const getAllLikesForPost = async (req,res)=>{
    const { postId } = req.params;
    const likes = await Like.find({ postId }).populate('userId', 'name');
    res.json({ likes });
}
