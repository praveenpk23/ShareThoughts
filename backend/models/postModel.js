  import mongoose from 'mongoose';

  const postSchema = new mongoose.Schema(
    {
      userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      post:       { type: String, required: true },
      isUpdated:  { type: Boolean, default: false },
    },
    { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
  );

  const Post = mongoose.model('Post', postSchema);
  export default Post;
