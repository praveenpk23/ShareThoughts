

// import React, { useState, useEffect } from "react";
// import { useGetUserProfileQuery } from "../../../app/UserApiSLice";
// import { useGetPostLikesQuery, useLikePostMutation, useUnLikePostMutation } from "../../../app/LikeApiSLice";

// const LikeButton = ({ postId }) => {
//   const [liked, setLiked] = useState(false);
//   const [count, setCount] = useState(0);
//   const [animate, setAnimate] = useState(false);

//   const { data: userData } = useGetUserProfileQuery();
//   // const { data: likesData } = useGetPostLikesQuery(postId);
//   const { data: likesData, refetch } = useGetPostLikesQuery(postId, {
//   refetchOnMountOrArgChange: true,
// });

//   const [likePost] = useLikePostMutation();
//   const [unLike] = useUnLikePostMutation();

//   useEffect(() => {
//     if (likesData) {
//       setCount(likesData.totalLikes || 0);
//       if (userData) {
//         setLiked(likesData.userLiked);
//       }
//     }
//   }, [likesData, userData]);

//   const handleClick = () => {
//     if (!userData) {
//       alert("Please login to like the post");
//       return;
//     }

//     setLiked(!liked);
//     setAnimate(true);
//     setTimeout(() => setAnimate(false), 400); // smooth pop duration

//     if (!liked) {
//       likePost(postId);
//       setCount(count + 1);
//     } else {
//       unLike(postId);
//       setCount(count - 1);
//     }
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className="flex flex-col items-center focus:outline-none relative"
//     >
//       {/* Heart Icon */}
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 24 24"
//         fill={liked ? "currentColor" : "none"}
//         stroke="currentColor"
//         strokeWidth={1.8}
//         className={`w-6 h-6 transition-all duration-300 ease-out transform ${
//           animate ? "scale-125" : "scale-100"
//         } ${liked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M12 21s-6.5-4.35-9.33-8.09C1.46 10.26 1.5 6.84 3.86 4.5a5.98 5.98 0 0 1 8.14 0L12 4.49l0-.01a5.98 5.98 0 0 1 8.14 0c2.36 2.34 2.4 5.76.19 8.41C18.5 16.65 12 21 12 21Z"
//         />
//       </svg>

//       {/* Count */}
//       <span className="text-xs text-gray-600 mt-1 select-none">{count}</span>

//       {/* Optional Spark/Burst effect */}
//       {animate && liked && (
//         <span className="absolute w-6 h-6 rounded-full bg-red-400 opacity-50 animate-ping"></span>
//       )}
//     </button>
//   );
// };

// export default LikeButton;



import React, { useState, useEffect } from "react";
import { useGetUserProfileQuery } from "../../../app/UserApiSLice";
import {
  useGetPostLikesQuery,
  useLikePostMutation,
  useUnLikePostMutation,
  LikeApiSlice,
} from "../../../app/LikeApiSLice";
import { apiSlice } from "../../../app/apiSlice";

const LikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [animate, setAnimate] = useState(false);

  const { data: userData } = useGetUserProfileQuery();

  // Fetch likes with proper cache tag
  const { data: likesData } = useGetPostLikesQuery(postId);

  const [likePost] = useLikePostMutation();
  const [unLike] = useUnLikePostMutation();

  // Initialize state
  useEffect(() => {
    if (likesData && userData) {
      setCount(likesData.totalLikes || 0);
      setLiked(likesData.userLiked);
    }
  }, [likesData, userData]);

  const handleClick = async () => {
    if (!userData) {
      alert("Please login to like the post");
      return;
    }

    // Optimistic UI update
    setLiked(prev => !prev);
    setCount(prev => liked ? prev - 1 : prev + 1);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 400);

    try {
      if (!liked) {
        await likePost(postId).unwrap();

        // Optional: Update cache immediately
        apiSlice.util.updateQueryData(
          "getPostLikes",
          postId,
          draft => {
            draft.totalLikes += 1;
            draft.userLiked = true;
          }
        );
      } else {
        await unLike(postId).unwrap();

        apiSlice.util.updateQueryData(
          "getPostLikes",
          postId,
          draft => {
            draft.totalLikes -= 1;
            draft.userLiked = false;
          }
        );
      }
    } catch (err) {
      console.error(err);
      // Revert UI on error
      setLiked(prev => !prev);
      setCount(prev => liked ? prev + 1 : prev - 1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center focus:outline-none relative"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        className={`w-6 h-6 transition-all duration-300 ease-out transform ${
          animate ? "scale-125" : "scale-100"
        } ${liked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21s-6.5-4.35-9.33-8.09C1.46 10.26 1.5 6.84 3.86 4.5a5.98 5.98 0 0 1 8.14 0L12 4.49l0-.01a5.98 5.98 0 0 1 8.14 0c2.36 2.34 2.4 5.76.19 8.41C18.5 16.65 12 21 12 21Z"
        />
      </svg>
      <span className="text-xs text-gray-600 mt-1 select-none">{count}</span>
      {animate && liked && (
        <span className="absolute w-6 h-6 rounded-full bg-red-400 opacity-50 animate-ping"></span>
      )}
    </button>
  );
};

export default LikeButton;
