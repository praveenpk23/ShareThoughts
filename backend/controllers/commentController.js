import Comment from "../models/commentModel.js";

// Add a new comment to a post
export const addComment = async (req, res) => {
  const { postId, comment } = req.body;
  const userId = req.user._id;

  const newComment = await Comment.create({ postId, userId, comment });
  res.status(201).json(newComment);
};

// Add a reply to a comment (or a reply to a reply using mention)
export const addReply = async (req, res) => {
  const { commentId, comment: replyText, mention } = req.body;
  const userId = req.user._id;

  if(!commentId || !replyText) {
    return res.status(400).json({ message: "commentId and reply text are required" });
  }
   const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $push: { reply: { userId, comment: replyText, mention, } },
      $set: { updatedAt: new Date() }
    },
    { new: true }
  ).populate("reply.userId", "name image").populate("userId", "name image");

 
  res.json(updatedComment);
};

// Get all comments and replies for a post
export const getCommentsForPost = async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ postId })
    .populate("userId", "name image") // commenter info
    .populate("reply.userId", "name image") // reply author info
    .sort({ createdAt: 1 }); // oldest first

  res.json(comments);
};
