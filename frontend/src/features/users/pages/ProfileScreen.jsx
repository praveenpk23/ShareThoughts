import React, { useState } from "react";
import { useGetUserProfileQuery } from "../UserApiSLice";
import {
  useGetAllPostsByUserQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "../../posts/PostsApiSlice";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
const ProfileScreen = () => {
  const { data: user, isLoading: userLoading } = useGetUserProfileQuery();
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
      {/* User Info */}
      <div className="flex items-center gap-6 mb-10 border-b pb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name
            )}&background=random`}
            alt={user?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold ">{user?.name}</h1>
          <p className="text-gray-500 text-lg">@{user?.username || "user"}</p>
          <p className="text-gray-100 mt-2 font-medium">
            {posts?.length || 0} {posts?.length === 1 ? "post" : "posts"}
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 relative hover:shadow-lg transition-shadow"
            >
              {/* Post content */}
              {editingPostId === post._id ? (
                <div className="flex flex-col gap-3 mt-6">
                  <textarea
                    className="textarea textarea-bordered w-full text-lg"
                    rows={4}
                    value={updatedText}
                    onChange={(e) => setUpdatedText(e.target.value)}
                  />
                  <div className="flex gap-3 justify-end mt-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleUpdate(post._id)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-sm btn-secondary btn-outline"
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
                <p className="text-gray-800 text-lg mt-6  ">{post.post}</p>
              )}

              <div className="flex  justify-around">
                <div className="absolute top-4 pb-5 left-4">
                   <Link
                                    to={`/profile`}
                                    className="font-semibold text-sm text-black hover:underline"
                                  >
                                    {post.userId.name}
                                  </Link>
                </div>
                <div>
                  {/* Edit/Delete buttons */}
              {editingPostId !== post._id && (
                <div className="absolute top-4 pb-5 right-4 flex gap-2">
                  <button
                    className="btn btn-sm btn-outline btn-info"
                    onClick={() => {
                      setEditingPostId(post._id);
                      setUpdatedText(post.post);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-lg mt-10">
            No posts found
          </p>
        )}
      </div>
       <Link to={"/post"}
                  className="btn btn-primary btn-circle fixed bottom-6 right-6 shadow-xl">
                  <FaPlus />
                </Link>
    </div>
  );
};

export default ProfileScreen;
