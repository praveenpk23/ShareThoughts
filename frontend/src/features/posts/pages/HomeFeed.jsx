import React, { useState, useEffect, useCallback } from "react";
import { useGetPostsQuery } from "../../../app/PostsApiSlice";
import { useGetUserProfileQuery } from "../../../app/UserApiSLice";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import LikeButton from "../components/LikeButton";
const Home = () => {
  const [page, setPage] = useState(1); // current page
  const [posts, setPosts] = useState([]); // combined posts list
  const [hasMore, setHasMore] = useState(true);
  const { data: user, isLoading } = useGetUserProfileQuery();
  const navigator = useNavigate();
  // query hook for posts (10 per page)
  const { data, isFetching, isError } = useGetPostsQuery({
    page,
    limit: 10,
  });

  // when new data arrives, append to posts
  useEffect(() => {
    if (!isLoading) {
      if (data) {
        setPosts((prev) => {
          const combined = page === 1 ? data : [...prev, ...data];
          const unique = Array.from(
            new Map(combined.map((p) => [p._id, p])).values()
          );
          return unique;
        });

        // If server gave fewer than limit or empty → no more data
        if (data?.length < 10) {
          setHasMore(false);
        }
      }
    }
  }, [data, page]);

  // infinite scroll handler
  const handleScroll = useCallback(() => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 0;

    if (nearBottom && !isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Add Post button click handler
  const handleAddPost = () => {
    // e.g., navigate to /create-post page or open a modal
    if (user) {
      navigator("/post");
    } else {
      navigator("/login?redirect=post");
    }
  };
  console.log(posts);
 
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
   <div className="min-h-screen bg-base-200 p-3 sm:p-4">
  <div className="w-full max-w-2xl mx-auto">
    {posts.map((post) => (
      <div
        key={post._id}
        className="bg-base-100 shadow-sm hover:shadow-md transition rounded-xl border border-base-300 mb-4"
      >
        {/* TOP BAR */}
        <div className="flex items-center gap-3 px-4 pt-3">
          {/* Avatar */}
          <Link to={`/profile/${post.userId._id}`}>
            <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-semibold">
              {post.userId?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
          </Link>

          {/* Name + timestamp */}
          <div className="flex flex-col min-w-0">
            <Link
              to={`/profile/${post.userId._id}`}
              className="inline-flex items-center gap-1 font-semibold text-sm hover:underline truncate"
            >
              {post.userId.username}
              {post.userId.isVerified && <VerifiedBadge />}
            </Link>

           <span className="text-xs text-base-content/60">
  {new Date(post.createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short", // short month format like "Sep"
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // 12-hour format with AM/PM
  })}
  {post.isUpdated && " · edited"}
</span>

          </div>
        </div>

        {/* POST CONTENT */}
        <div className="px-4 py-3">
          <Link to={`/post/${post._id}`}>
            <p className="text-base leading-relaxed line-clamp-4 text-base-content">
              {post.post || "No content"}
            </p>
          </Link>

          {/* ACTIONS */}
          <div className="mt-3 flex items-center gap-4">
            <LikeButton postId={post._id} />
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Loading */}
  {isFetching && (
    <div className="flex justify-center my-6">
      <span className="loading loading-spinner loading-md"></span>
    </div>
  )}

  {/* Floating Add Button */}
  <button
    className="btn btn-primary btn-circle fixed bottom-6 right-4 sm:right-6 shadow-xl"
    onClick={handleAddPost}
  >
    <FaPlus />
  </button>

  {/* Error */}
  {isError && (
    <div className="text-center text-error mt-4">
      Failed to load posts
    </div>
  )}

  {!hasMore && (
    <div className="text-center text-base-content/60 my-4">
      No more posts to load.
    </div>
  )}
</div>

  );
};

export default Home;
