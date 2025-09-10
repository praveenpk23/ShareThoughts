import React from "react";
import { useGetAllPostsByUserQuery } from "../../posts/PostsApiSlice";
import { Link, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useGetAllPostsByUserQuery(id);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  if (isError)
    return (
      <div className="alert alert-error shadow-lg max-w-lg mx-auto mt-10">
        <span>{error?.data?.message || "Error fetching posts"}</span>
      </div>
    );

  if (!posts || posts.length === 0)
    return (
      <div className="text-center text-gray-500 mt-10">
        No posts found for this user.
      </div>
    );

  const user = posts[0]?.userId;

  // nice gradient colours for posts
  const gradients = [
    // "bg-gradient-to-br from-pink-400 via-red-300 to-orange-200",
    // "bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-200",
    // "bg-gradient-to-br from-teal-400 via-emerald-300 to-green-200",
    // "bg-gradient-to-br from-sky-400 via-cyan-300 to-blue-200",
    // "bg-gradient-to-br from-yellow-400 via-orange-300 to-rose-200",
  ];

  return (
    <div className="max-w-5xl mx-auto mt-8">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl shadow-md">
        <div className="avatar">
          <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name
              )}&background=random`}
              alt={user?.name}
            />
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-neutral">{user?.name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {posts.length} post{posts.length > 1 && "s"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed justify-center sm:justify-start mt-6">
        <a className="tab tab-active">Posts</a>
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {posts.map((post, index) => (
          <Link to={`/post/${post._id}`}>
            <div
              key={post._id}
              className={`card shadow-xl text-white hover:shadow-2xl transition duration-300 ${
                gradients[index % gradients.length]
              }`}
            >
              <div className="card-body">
                <p className="text-lg font-semibold leading-snug h-20 overflow-hidden">
                  {post.post}
                </p>
                <p className="text-xs opacity-80 mt-2">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PostDetails;
