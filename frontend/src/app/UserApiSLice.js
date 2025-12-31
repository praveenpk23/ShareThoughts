import { apiSlice } from "./apiSlice";
import { USER_URL } from "../Constant";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    getUserById: builder.query({
      query: (userId) => ({
        url: `${USER_URL}/getuser?userId=${userId}`,
        method: "GET",
      }),
      // providesTags:['User']
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: `${USER_URL}/profile`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getUsernameSuggestions: builder.query({
      query: (search) => ({
        url: `${USER_URL}/username-suggestions`,
        params: { search },
      }),
    }),
  }),
});
export { userApiSlice };
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetUserByIdQuery,
  useGetUserProfileQuery,
  useGetUsernameSuggestionsQuery,
} = userApiSlice;
