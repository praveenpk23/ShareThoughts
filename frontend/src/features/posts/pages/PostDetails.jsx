import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetPostByIdQuery } from "../../../app/PostsApiSlice";
import LikeButton from "../components/LikeButton";

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isLoading, isError, error } = useGetPostByIdQuery(id);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (isError)
    return (
      <div className="alert alert-error shadow-lg max-w-lg mx-auto mt-10">
        <span>{error?.data?.message || "Error fetching post"}</span>
      </div>
    );

  if (!post)
    return <div className="text-center text-gray-500 mt-10">No post found</div>;

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              post.userId?.name
            )}&background=random`}
            alt={post.userId?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <Link
            to={`/profile/${post.userId?._id}`}
            className="font-medium hover:underline"
          >
            <span className="font-semibold text-gray-900 text-sm">
              {post.userId?.name}
            </span>
            {/* {post.userId?.name } */}
          </Link>
          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
            {post.isUpdated && (
              <span className="ml-1 italic text-gray-400">(updated)</span>
            )}
          </span>
        </div>
      </div>

      {/* Media / image */}
      {post.image && (
        <div className="w-full">
          <img
            src={post.image}
            alt="Post content"
            className="w-full object-cover max-h-[500px]"
          />
        </div>
      )}

      {/* Caption / body */}
      <div className="px-4 py-3">
        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
          {post.post}
        </p>
      </div>

      {/* Meta info */}
      <div className="px-4 pb-4 text-xs text-gray-500 border-t border-gray-100">
        <div className="pt-3 flex flex-col sm:flex-row sm:gap-6">
          <span>
           <LikeButton postId={post._id} />
          </span>
          <span>
          </span>
          <span>
            <strong className="font-medium text-gray-700">Created:</strong>{" "}
            {new Date(post.createdAt).toLocaleString()}
          </span>
          {post.isUpdated && (
            <span>
              <strong className="font-medium text-gray-700">Updated:</strong>{" "}
              {new Date(post.updatedAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
