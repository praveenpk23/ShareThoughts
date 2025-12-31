import React, { useState } from "react";
import { useGetUserProfileQuery } from "../../../app/UserApiSLice";
import {
  useGetAllPostsByUserQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "../../../app/PostsApiSlice";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { VerifiedBadge } from "../../../VerificationIcon";
const ProfileScreen = () => {
  const { data: user, isLoading: userLoading } = useGetUserProfileQuery();
  // console.log("User Profile Data:", user); // ✅ debug
  const {
    data: posts,
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useGetAllPostsByUserQuery(user?._id);

  const [deletePost] = useDeletePostMutation();
  const [updatePost] = useUpdatePostMutation();

  const [editingPostId, setEditingPostId] = useState(null);
  const [updatedText, setUpdatedText] = useState("");

  if (userLoading || postsLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id).unwrap();
      toast.success("Post deleted successfully");
      refetchPosts();
    } catch (err) {
      toast.error("Failed to delete post");
      console.error(err);
    }
  };

  const handleUpdate = async (id) => {
    if (!updatedText.trim()) return toast.error("Post cannot be empty");
    try {
      await updatePost({ id, post: updatedText }).unwrap();
      toast.success("Post updated successfully");
      setEditingPostId(null);
      setUpdatedText("");
      refetchPosts();
    } catch (err) {
      toast.error("Failed to update post");
      console.error(err);
    }
  };
return (
  <div className="max-w-4xl mx-auto mt-12 px-6">

    {/* USER INFO */}
    <div className="flex items-center gap-6 mb-10 border-b border-base-300 pb-6">
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-base-300 shadow-sm bg-base-200">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name
          )}&background=random`}
          alt={user?.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-base-content flex items-center gap-1">
          @{user?.username}
          {user?.isVerified && <VerifiedBadge />}
        </h1>

        <p className="opacity-60 text-lg">
          {user?.name || "user"}
        </p>

        <p className="mt-2 font-medium opacity-80">
          {posts?.length || 0}{" "}
          {posts?.length === 1 ? "post" : "posts"}
        </p>
      </div>
    </div>

    {/* POSTS */}
    <div className="space-y-6">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
        <div
  key={post._id}
  className="bg-base-100 border border-base-300 rounded-2xl shadow-md p-5 sm:p-6 hover:shadow-lg transition"
>
  {/* HEADER */}
  <div className="flex items-start justify-between gap-4">
    {/* USER NAME */}
    <Link
      to="/profile"
      className="font-semibold text-sm sm:text-base text-base-content hover:underline"
    >
      {post.userId.name}
    </Link>

    {/* ACTIONS */}
    {editingPostId !== post._id && (
      <div className="flex gap-2">
        <button
          className="btn btn-xs sm:btn-sm btn-outline btn-info"
          onClick={() => {
            setEditingPostId(post._id);
            setUpdatedText(post.post);
          }}
        >
          Edit
        </button>
        <button
          className="btn btn-xs sm:btn-sm btn-outline btn-error"
          onClick={() => handleDelete(post._id)}
        >
          Delete
        </button>
      </div>
    )}
  </div>

  {/* CONTENT */}
  {editingPostId === post._id ? (
    <div className="flex flex-col gap-3 mt-4">
      <textarea
        className="textarea textarea-bordered w-full text-sm sm:text-base"
        rows={4}
        value={updatedText}
        onChange={(e) => setUpdatedText(e.target.value)}
      />

      <div className="flex justify-end gap-3">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleUpdate(post._id)}
        >
          Update
        </button>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => {
            setEditingPostId(null);
            setUpdatedText("");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <p className="text-base-content text-base sm:text-lg mt-4 leading-relaxed">
      {post.post}
    </p>
  )}
</div>

        ))
      ) : (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-base-300 rounded-2xl bg-base-100">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-base-200 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 8h10M7 12h6m-2 8h-4a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v6"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-base-content">
            No posts yet
          </h2>

          <p className="opacity-60 mt-2 max-w-sm">
            When you share thoughts, ideas, or moments, they’ll appear here.
          </p>

          <Link to="/post" className="mt-6 btn btn-primary px-8">
            Create your first post
          </Link>
        </div>
      )}
    </div>

    {/* FLOATING BUTTON */}
    <Link
      to="/post"
      className="btn btn-primary btn-circle fixed bottom-6 right-6 shadow-xl"
    >
      <FaPlus />
    </Link>
  </div>
);

};

export default ProfileScreen;
