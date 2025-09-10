import React, { useState, useEffect, useCallback } from "react";
import { useGetPostsQuery } from "../PostsApiSlice";
import { useGetUserProfileQuery } from "../../users/UserApiSLice";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [page, setPage] = useState(1); // current page
  const [posts, setPosts] = useState([]); // combined posts list
  const [hasMore, setHasMore] = useState(true);
  const { data: user } = useGetUserProfileQuery();
  const navigator = useNavigate();
  // query hook for posts (10 per page)
  const { data, isFetching, isError } = useGetPostsQuery({
    page,
    limit: 10,
  });

  // when new data arrives, append to posts
  useEffect(() => {
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
  }, [data, page]);

  // infinite scroll handler
  const handleScroll = useCallback(() => {
    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

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
  return (
    <div className="min-h-screen bg-base-200 p-4">
      {/* <h1 className="text-3xl font-bold mb-6">Latest Posts</h1> */}

      {/* {posts.map((post) => (
        <Link to={`/post/${post._id}`} key={post._id} className="block mb-4">
          <div
          key={post._id}
          className="card bg-base-100 shadow-md mb-4 hover:shadow-xl transition-all"
        >
          <div className="card-body">
            <Link to={`/profile/${post.userId._id}`} className="card-title text-lg">  
            <h2 className="card-title">{post.userId.name}</h2>
            </Link>
            <p>{post.post || "No content"}</p>
            <span className="text-xs opacity-60">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        </Link>
      ))} */}
      <div className="w-[800px]  mx-auto">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white dark:bg-neutral shadow-sm hover:shadow-md transition rounded-xl border border-gray-200 dark:border-neutral mb-4"
          >
            {/* Top bar: avatar (initials) + name + timestamp */}
            <div className="flex items-center gap-3 px-4 pt-3">
              {/* Avatar with initials */}
              <Link to={`/profile/${post.userId._id}`}>
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {post.userId.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              </Link>

              {/* Name + timestamp */}
              <div className="flex flex-col">
                <Link
                  to={`/profile/${post.userId._id}`}
                  className="font-semibold text-sm hover:underline"
                >
                  {post.userId.name}
                </Link>
                <span className="text-xs opacity-60">
                  {new Date(post.createdAt).toLocaleString()}
                  {post.isUpdated && " (edited)"}
                </span>
              </div>
            </div>

            {/* Post content */}
            <div className="px-4 py-3">
              <Link to={`/post/${post._id}`}>
                <p className="text-base leading-snug line-clamp-3">
                  {post.post || "No content"}
                </p>
              </Link>

              {/* Optional image */}
              {post.image && (
                <div className="mt-3">
                  <img
                    src={post.image}
                    alt=""
                    className="rounded-xl max-h-96 w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Loading spinner when fetching more */}
      {isFetching && (
        <div className="flex justify-center my-6">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Floating Add Post Button */}
      <button
        className="btn btn-primary btn-circle fixed bottom-6 right-6 shadow-xl"
        onClick={handleAddPost}
      >
        <FaPlus />
      </button>

      {/* Error state */}
      {isError && (
        <div className="text-center text-red-500 mt-4">
          Failed to load posts
        </div>
      )}
      {!hasMore && (
        <div className="text-center text-gray-500 my-4">
          No more posts to load.
        </div>
      )}
    </div>
  );
};

export default Home;
