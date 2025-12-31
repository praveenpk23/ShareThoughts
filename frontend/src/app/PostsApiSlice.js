import { apiSlice } from "./apiSlice";
import { POST_URL } from "../Constant";
import {USER_URL} from "../Constant";
import {COMMENT_URL} from "../Constant";
export const postsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create post (mutation)
    createPost: builder.mutation({
      query: (newPost) => ({
        url: POST_URL, // /api/posts
        method: "POST",
        body: newPost,
      }),
    }),

    // Get posts (all or by userId, with pagination)
    getPosts: builder.query({
      query: ({ userId, page, limit } = {}) => {
        const params = new URLSearchParams();
        if (userId) params.append("userId", userId);
        params.append("page", page);
        params.append("limit", limit);
        return `${POST_URL}/?${params.toString()}`; // GET /api/posts?userId=...&page=...
      },
    }),

    // Get a single post by id
    getPostById: builder.query({
      query: (id) => `${POST_URL}/post/${id}`, // GET /api/:id
    }),

    // Get all posts by userId
    getAllPostsByUser: builder.query({
      query: (id) => `${POST_URL}/allposts/${id}`, // GET /api/posts/user/:id
    }),

    // Update post
    updatePost: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${POST_URL}/post/${id}`, // PUT /api/posts/:id
        method: "PUT",
        body: data, // { post: 'new text' }
      }),
    }),

    // Delete post
    deletePost: builder.mutation({
      query: (id) => ({
        url: `${POST_URL}/post/${id}`, // DELETE /api/posts/:id
        method: "DELETE",
      }),
    }),


       // 🔹 Add comment to a post
    addComment: builder.mutation({
      query: ({ postId, comment }) => ({
        url: COMMENT_URL,
        method: "POST",
        body: { postId, comment },
      }),
      invalidatesTags: ["Comments"],
    }),

    // 🔹 Add reply to a comment
    addReply: builder.mutation({
      query: ({ commentId, comment, mention }) => ({
        url: `${COMMENT_URL}/reply`,
        method: "POST",
        body: { commentId, comment, mention },
      }),
      invalidatesTags: ["Comments"],
    }),

    // 🔹 Get comments for a post
    getCommentsByPost: builder.query({
      query: (postId) => `${COMMENT_URL}/${postId}`,
      providesTags: ["Comments"],
    }),

  }),
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useGetAllPostsByUserQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddCommentMutation,
  useAddReplyMutation,
  useGetCommentsByPostQuery,
} = postsApi;


