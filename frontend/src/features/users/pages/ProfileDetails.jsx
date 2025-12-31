import React from "react";
import { useGetAllPostsByUserQuery } from "../../../app/PostsApiSlice";
import { Link, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useGetAllPostsByUserQuery(id);
  console.log("Posts Data:", posts); // ✅ debug

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

  // if (!posts || posts.length === 0)
  //   return (
  //     <div className="text-center text-gray-500 mt-10">
  //       No posts found for this user.
  //     </div>
  //   );

  const user = posts[0]?.userId;

  // nice gradient colours for posts
  const gradients = [
    // "bg-gradient-to-br from-pink-400 via-red-300 to-orange-200",
    // "bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-200",
    // "bg-gradient-to-br from-teal-400 via-emerald-300 to-green-200",
    // "bg-gradient-to-br from-sky-400 via-cyan-300 to-blue-200",
    // "bg-gradient-to-br from-yellow-400 via-orange-300 to-rose-200",
  ];

const VerifiedBadge = () => (
  <svg
    className="w-5 h-5 inline-block ml-2"
    viewBox="0 0 24 24"
    aria-label="Verified"
  >
    <defs>
      <mask id="tick-cutout">
        {/* Visible area */}
        <rect width="24" height="24" fill="white" />

        {/* Cut-out check */}
        <path
          d="M10.4 15.6
             7.7 12.9
             9.1 11.5
             10.4 12.8
             14.9 8.3
             16.3 9.7z"
          fill="black"
        />
      </mask>
    </defs>

    {/* Blue star badge with transparent tick */}
    <path
      mask="url(#tick-cutout)"
      fill="#0095F6"
      d="M22.5 12
         l-2.2-2.5.3-3.3
         -3.2-.7-1.7-2.8
         L12 3.9 8.3 2.7
         6.6 5.5l-3.2.7
         .3 3.3L1.5 12
         l2.2 2.5-.3 3.3
         3.2.7 1.7 2.8
         3.8-1.2 3.8 1.2
         1.7-2.8 3.2-.7
         -.3-3.3L22.5 12z"
    />
  </svg>
);



return (
  <div className="max-w-5xl mx-auto mt-6 sm:mt-8 px-4">
    {/* ================= PROFILE HEADER ================= */}
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-base-100 border border-base-300 rounded-2xl shadow-md">
      
      {/* Avatar */}
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

      {/* User Info */}
      <div className="text-center sm:text-left flex-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-base-content flex items-center justify-center sm:justify-start gap-2">
          @{user?.username}
          {user?.isVerified && <VerifiedBadge />}
        </h2>

        <p className="text-base-content/70 text-base sm:text-lg">
          {user?.name || "User"}
        </p>

        <p className="mt-1 text-sm text-base-content/60">
          {posts.length} post{posts.length !== 1 && "s"}
        </p>
      </div>
    </div>

    {/* ================= TABS ================= */}
    <div className="tabs tabs-boxed justify-center sm:justify-start mt-6 bg-base-200 w-fit">
      <a className="tab tab-active">Posts</a>
    </div>

    {/* ================= POSTS / EMPTY STATE ================= */}
    {posts.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {posts.map((post) => (
          <Link key={post._id} to={`/post/${post._id}`}>
            <div className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition">
              <div className="card-body">
                <p className="text-base-content text-base font-medium leading-snug line-clamp-4 min-h-[5rem]">
                  {post.post}
                </p>

                <p className="text-xs text-base-content/60 mt-3">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center text-center mt-16 py-20 border border-dashed border-base-300 rounded-2xl bg-base-100">
        
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-base-content/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Text */}
        <h3 className="text-xl sm:text-2xl font-semibold text-base-content">
          No posts yet
        </h3>

        <p className="text-base-content/60 mt-2 max-w-sm">
          @{user?.username} hasn’t shared any posts yet.
        </p>
      </div>
    )}
  </div>
);


};

export default PostDetails;
