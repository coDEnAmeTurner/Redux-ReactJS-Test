import {
  createSlice,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
//date support
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.toString().localeCompare(a.date.toString()),
});

//postsAdapter.getInitialState already provides: the entities part, and the ids part
const initialState = postsAdapter.getInitialState();

//this is how you seperate endpoinst for posts from users
export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      transformResponse: (responseData) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post?.date) post.date = sub(new Date(), { minutes: min }).toISOString();
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      //it's a list of tags, but now each tag is an object
      //tag is to be invalidated which changes the reducer
      //so each post now can invalidate object LIST or object the post's id
      //and it is either the entire list rerenders or only that post rerenders
      providesTags: (result, error, arg) => [
        { type: "Post", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Post", id })),
      ],
    }),
    getPostsByUserId: builder.query({
      query: (id) => `/posts/?userId=${id}`,
      transformResponse: (responseData) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post?.date) post.date = sub(new Date(), { minutes: min });
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => [
        { type: "Post", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Post", id })),
      ],
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      //arg is that initialPost
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: {
          id,
        },
      }),
      //arg is that initialPost
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg.id }],
    }),
    addReaction: builder.mutation({
      query: ({postId, reactions})=>({
        url: `posts/${postId}`,
        method: 'PATCH',
        //in a real app, a user can' t do the same reaction more than once
        body: {reactions}
      }),
      //this is where the Optimistic Update happens:
      //Optimistic Update means the frontend updates first, then the API is called so that db is updated to match the Frontend
      async onQueryStarted({postId, reactions}, {dispatch, queryFulfilled}) {
        //`updateQueryData` requiers the enpoint name and cache key arguments,
        //so it knows which piece of cache state to update
        //cache key argument below is undefined
        const patchResult = dispatch(extendedApiSlice.util.updateQueryData('getPosts', undefined, draft=>{
          const post = draft.entities[postId]
          if (post) post.reactions = reactions
        }))
      try {
          await queryFulfilled
        } catch {
        //this is when the API fails, the frontend then must match the db, hence undo
          patchResult.undo()
        }
      }
    })
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation
} = extendedApiSlice;

//return the query object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(
  selectPostsResult,
  (postsResult) => postsResult.data
);

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of the state
  //I thought state.posts ain't used any longer???????
} = postsAdapter.getSelectors(
  (state) => selectPostsData(state) ?? initialState
);
