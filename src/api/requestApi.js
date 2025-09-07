import { baseApi } from "./baseApi";

export const requestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // LIST
    getRequests: builder.query({
      query: () => "/requests",
      providesTags: (res) =>
        res?.length
          ? [
              ...res.map((r) => ({ type: "Request", id: r.id })),
              { type: "Requests", id: "LIST" }
            ]
          : [{ type: "Requests", id: "LIST" }]
    }),

    // DETAIL + comments embed
    getRequestById: builder.query({
      query: (id) => `/requests/${id}?_embed=comments`,
      providesTags: (_res, _e, id) => [{ type: "Request", id }]
    }),

    // CREATE
    createRequest: builder.mutation({
      query: (body) => ({ url: "/requests", method: "POST", body }),
      invalidatesTags: [{ type: "Requests", id: "LIST" }]
    }),

    // UPDATE
    updateRequest: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/requests/${id}`,
        method: "PATCH",
        body: patch
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Request", id }]
    }),

    // COMMENTS
    addComment: builder.mutation({
      query: (body) => ({ url: "/comments", method: "POST", body }),
      invalidatesTags: (_r, _e, b) => [{ type: "Request", id: b.requestId }]
    }),

    // USERS
    getUsers: builder.query({
      query: () => "/users",
      providesTags: [{ type: "Users", id: "LIST" }]
    }),

    // LOGIN 
    loginByCredentials: builder.query({
      query: ({ username, password }) =>
        `/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
  })
});

export const {
  useGetRequestsQuery,
  useGetRequestByIdQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useAddCommentMutation,
  useGetUsersQuery,
  useLazyLoginByCredentialsQuery
} = requestApi;
