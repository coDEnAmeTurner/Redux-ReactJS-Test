import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
//date support
import { sub } from "date-fns";
import axios from "axios";

//public site that provides APIs for placeholding
const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const initialState = {
  posts: [],
  status: "idle", //idle | loading | succeeded | failed
  error: null,
};

//in redux, define async method like this:
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return [...response.data];
  } catch (err) {
    return err.message;
  }
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    try {
      const response = await axios.post(POSTS_URL, initialPost);
      return response.data;
    } catch (err) {
      return err.message;
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost) => {
    const { id } = initialPost;
    try {
      //this won't update a thing, and it will return 500
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
      return response.data;
    } catch (err) {
      //but the state of initialPost actually already updated, in redux, so we can return that, just for
      //testing if redux is working correctly, it's just that the fake api fails
      // return err.message;
      return initialPost; //only for testing redux
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const response = await axios.delete(`${POSTS_URL}/${id}`);
      if (response?.status === 200) return initialPost;
      return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
      return err.message;
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPosts: {
      //the state is the initialState
      reducer(state, action) {
        //.push will normally mutate the state.
        // State Mutation means it is the content of the state that changes, not the state itself.
        // If the state weren't to change, the component wouldn't render and that's not the desired behavior
        // But with redux, it inherently uses ImmerJS, which makes .push not mutate the state
        // instead assign a new value to the state.
        state.posts.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            //explicitly type "date" so that it won't follow the order
            date: new Date().toISOString(),
            content,
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost)
        //here's another occurence of not-mutating-the-state behaviour of ImmerJS
        existingPost.reactions[reaction]++;
    },
  },
  //these reducers are called according to the state of the above fetchedPosts promise
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      //action.payload: the response from promise
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });

        state.posts = state.posts.concat(loadedPosts);
      })
      //action.error: the error from promise
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        console.log(action.payload);
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          //the api won't fail, but won't return the desired resp
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        state.status = "succeeded";
        const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = [...posts, action.payload];
      })
      .addCase(deletePost.fulfilled, (state, action)=>{
        if (!action.payload?.id) {
          console.log('Delete could not complete')
          console.log(action.payload)
          return ;
        }
        const {id} =  action.payload;
        const posts = state.posts.filter(post=>post.id !== id);
        state.posts = posts;
      })
  },
});

//state.posts: return the "posts" reducer in createSlice
//.posts again: return the initialState.posts array
export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const selectPostsById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId);

export const { addPosts, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
