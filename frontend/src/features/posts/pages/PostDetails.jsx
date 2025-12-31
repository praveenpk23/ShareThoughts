import React,{useState} from "react";
import { Link, useParams } from "react-router-dom";
import { useGetPostByIdQuery,useGetAllPostsByUserQuery,  useAddReplyMutation, useAddCommentMutation , useGetCommentsByPostQuery} from "../../../app/PostsApiSlice";
import LikeButton from "../components/LikeButton";
import { VerifiedBadge } from "../../../VerificationIcon";
import {  useGetUserProfileQuery} from '../../../app/UserApiSLice';
const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isLoading, isError, error } = useGetPostByIdQuery(id);
  const [commentText, setCommentText] = useState("");

const [replyingTo, setReplyingTo] = useState(null);
const [replyText, setReplyText] = useState("");

const [addReply, { isLoading: replying }] =
  useAddReplyMutation();

  const {
    data: comments = [],
    isLoading: commentsLoading,
  } = useGetCommentsByPostQuery(id);

  const [addComment, { isLoading: postingComment }] =
    useAddCommentMutation();

    const handleAddComment = async () => {
  if (!commentText.trim()) return;

  try {
    await addComment({
      postId: id,
      comment: commentText,
    }).unwrap();

    setCommentText(""); // clear input
  } catch (err) {
    console.error("Failed to add comment", err);
  }
};
  const { data: profileData, refetch: refetchProfile } =
    useGetUserProfileQuery();

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


const formatDateShort = (isoDate) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, "0");

  const monthNamesShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = monthNamesShort[date.getMonth()];

  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};


const handleReply = async (commentId, username) => {
  if (!replyText.trim()) return;

  try {
    await addReply({
      postId: id,
      commentId,
      comment: replyText,
      mention: `@${username}`,
    }).unwrap();

    setReplyText("");
    setReplyingTo(null);
  } catch (err) {
    console.error("Reply failed", err);
  }
};


 return (
  <div
    className="max-w-xl mx-auto mt-8 
    bg-base-100 
    rounded-2xl shadow-md 
    border border-base-300 
    overflow-hidden transition"
  >
    {/* ================= HEADER ================= */}
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-base-200">
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
          className="font-semibold text-sm inline-flex items-center gap-1 
          text-base-content hover:underline"
        >
          {post.userId?.username}
          {post.userId?.isVerified && <VerifiedBadge />}
        </Link>

        <span className="text-xs text-base-content/60">
          {new Date(post.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
          {post.isUpdated && " · edited"}
        </span>
      </div>
    </div>

    {/* ================= MEDIA ================= */}
    {post.image && (
      <div className="w-full bg-black">
        <img
          src={post.image}
          alt="Post content"
          className="w-full object-cover max-h-[500px]"
        />
      </div>
    )}

    {/* ================= CAPTION ================= */}
    <div className="px-4 py-3">
      <p className="text-base-content text-base leading-relaxed whitespace-pre-wrap">
        {post.post}
      </p>
    </div>

    {/* ================= META ================= */}
    <div className="px-4 pb-4 text-xs text-base-content/60 border-t border-base-300">
      <div className="pt-3 flex flex-col sm:flex-row sm:gap-6 gap-2">
        <LikeButton postId={post._id} />

        <span>
          <strong className="font-medium text-base-content">Created:</strong>{" "}
          {formatDateShort(post.createdAt)}
        </span>

        {post.isUpdated && (
          <span>
            <strong className="font-medium text-base-content">Updated:</strong>{" "}
            {formatDateShort(post.updatedAt)}
          </span>
        )}
      </div>
    </div>

    {/* ================= COMMENTS ================= */}
   {/* ================= COMMENTS ================= */}
<div className="mt-6 px-4 pb-6 border-t border-base-300">
  <h3 className="text-lg font-semibold mb-3 text-base-content">
    Comments
  </h3>

  {/* ===== ADD COMMENT ===== */}
  <div className="flex items-start gap-3 mb-5">
    <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-semibold">
      {profileData?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </div>

    <div className="flex-1 bg-base-200 border border-base-300 rounded-xl p-3">
      <textarea
        rows="2"
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="w-full bg-transparent text-sm resize-none outline-none"
      />

      <div className="flex justify-end mt-2">
        <button
          onClick={handleAddComment}
          disabled={postingComment}
          className="btn btn-sm btn-primary"
        >
          {postingComment ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  </div>

  {/* ===== COMMENTS LIST ===== */}
  <div className="space-y-4">
    {comments.map((c) => {
      const initials = c.userId?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return (
        <div
          key={c._id}
          className="flex items-start gap-3 bg-base-100 border border-base-300 rounded-xl p-3"
        >
          <Link className="hover:text-primary" to={`/profile/${c.userId?._id}`}>
          <div className="w-9 h-9 rounded-full bg-secondary text-secondary-content flex items-center justify-center font-semibold text-sm">
            {initials}
          </div>
          </Link>

          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <Link className="hover:text-primary" to={`/profile/${c.userId?._id}`}>
                  <p className="font-medium text-sm">{c.userId?.username}</p>
              </Link>
              <span className="text-xs opacity-60">
                {new Date(c.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <p className="text-sm opacity-80">{c.comment}</p>

            {/* ACTIONS */}
            <div className="flex items-center gap-4 mt-2 text-xs">
              {/* <button className="opacity-60 hover:text-primary">
                Like
              </button> */}
              <button
                onClick={() => {
                  setReplyingTo(c._id);
                  // setReplyText(`@${c.userId?.username} `);
                }}
                className="opacity-60 hover:text-primary"
              >
                Reply
              </button>
            </div>

            {/* ===== REPLY INPUT ===== */}
            {replyingTo === c._id && (
              <div className="mt-3 pl-6">
                <textarea
                  rows="2"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full bg-base-200 border border-base-300 rounded-lg p-2 text-sm resize-none outline-none"
                />

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() =>
                      handleReply(c._id, c.userId?.username)
                    }
                    disabled={replying}
                    className="btn btn-xs btn-primary"
                  >
                    {replying ? "Replying..." : "Reply"}
                  </button>

                  <button
                    onClick={() => setReplyingTo(null)}
                    className="btn btn-xs btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ===== REPLIES ===== */}
            {c.reply?.length > 0 && (
              <div className="mt-3 space-y-2 pl-6 sm:pl-10">
                {c.reply.map((r) => (
                  <div key={r._id} className="text-sm">
                    <span className="font-medium">
                      {r.userId?.name}
                    </span>{" "}
                    {/* {r.mention && (
                      <span className="text-primary">
                        {r.mention}
                      </span>
                    )} */}
                    : {r.comment}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>

  </div>
);

};

export default PostDetails;
