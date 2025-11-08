import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate likes by the same user on the same content
likeSchema.index({ contentId: 1, userId: 1 }, { unique: true });

const ContentLike = mongoose.model('ContentLike', likeSchema);
export default ContentLike;
