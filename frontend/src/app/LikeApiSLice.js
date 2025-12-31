import { apiSlice } from "./apiSlice";
import { LIKE_URL } from "../Constant";

const likeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    likePost: builder.mutation({
      query: (postId) => ({
        url: `${LIKE_URL}/like`,
        method: "POST",
        body: { postId },
      }),
      // invalidatesTags: (result, error, arg) => [{ type: "PostLikes", id: arg }],
        // Invalidate only this post's likes so getPostLikes updates automatically
      invalidatesTags: (result, error, arg) => [{ type: "PostLikes", id: arg }],
    }),
    unLikePost: builder.mutation({
      query: (postId) => ({
        url: `${LIKE_URL}/unlike`,
        method: "POST",
        body: { postId },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "PostLikes", id: arg }],
    }),
    getPostLikes: builder.query({
      query: (postId) => ({
        url: `${LIKE_URL}/${postId}/likes`,
        method: "GET",
      }),
      // providesTags: ["Like"],
      providesTags: (result, error, contentId) => [
        { type: "Like", id: contentId },
      ],
    }),
    getLikedPosts: builder.query({
      query: () => ({
        url: `${LIKE_URL}/my/liked`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLikePostMutation,
  useUnLikePostMutation,
  useGetPostLikesQuery,
  useGetLikedPostsQuery,
} = likeApiSlice;
export { likeApiSlice as LikeApiSlice };
