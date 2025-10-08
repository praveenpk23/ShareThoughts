import React, { useState } from "react";
import { useCreatePostMutation } from "../../../app/PostsApiSlice";
import { useGetUserProfileQuery } from "../../../app/UserApiSLice";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const PostForm = () => {
  const [postText, setPostText] = useState("");
  const [createPost, { isLoading, isSuccess, isError, error }] =
    useCreatePostMutation();
  const { data: userProfile } = useGetUserProfileQuery();
  const navigator = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ post: postText }).unwrap(); // body { post: '...' }
      setPostText("");
      toast.success("Post created successfully!");
    } catch (err) {
      console.error("Failed to create post", err);
    }
  };

  useEffect(() => {
    if (!userProfile?.name) {
      navigator("/login?redirect=/post");
    }
  }, [navigator, userProfile?.name]);

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl p-4">
        <h2 className="text-xl font-bold mb-4">Create Post</h2>
        <textarea
          className="textarea textarea-bordered w-full mb-4"
          placeholder="What's on your mind?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          required
        ></textarea>
        <button className="btn btn-primary w-full" disabled={isLoading}>
          {isLoading ? "Posting..." : "Post"}
        </button>
        {isSuccess && <p className="text-green-600 mt-2">Post created!</p>}
        {isError && (
          <p className="text-red-600 mt-2">
            {error?.data?.message || "Error creating post"}
          </p>
        )}
      </form>
    </div>
  );
};

export default PostForm;
