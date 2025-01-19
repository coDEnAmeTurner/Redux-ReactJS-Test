import { 
  createSlice, 
  createAsyncThunk, 
  createSelector ,
  createEntityAdapter
} from "@reduxjs/toolkit";
//date support
import { sub } from "date-fns";
import axios from "axios";

//public site that provides APIs for placeholding
const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

//this with the initial state is the core of a concept known as Normalization
//Normalization means: 
//Items should be stored in a way that 
//- there's no duplication of data
//- there's a lookup structure for each item's id
//Redux implementation for this is a State Shape that looks like this
//{
// posts: {
//   ids: [1,2,3,...], ids lookup
//   entities: { items store
//     '1': {
//       userId: 1,
//       id: 1,
//       title: something
//     }
//   }
// }
//}
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b)=>b.date.localeCompare(a.date)
})

// const initialState = {
//   posts: [],
//   status: "idle", //idle | loading | succeeded | failed
//   error: null,
//   count: 0
// };

//postsAdapter.getInitialState already provides: the entities part, and the ids part
const initialState = postsAdapter.getInitialState({
  status: "idle", //idle | loading | succeeded | failed
  error: null,
  count: 0
});

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
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      //const existingPost = state.posts.find((post) => post.id === postId);
      //after Normalization:
      const existingPost = state.entities[postId];
      
      if (existingPost)
        //here's another occurence of not-mutating-the-state behaviour of ImmerJS
        existingPost.reactions[reaction]++;
    },
    increaseCount(state, action) {
      state.count += 1;
    }
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

        // state.posts = state.posts.concat(loadedPosts);
        // after Normalization
        postsAdapter.upsertMany(state, loadedPosts);
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
        // state.posts.push(action.payload);
        // after Normalization
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          //the api won't fail, but won't return the desired resp
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }
        state.status = "succeeded";
        action.payload.date = new Date().toISOString();
        // const { id } = action.payload;
        // const posts = state.posts.filter((post) => post.id !== id);
        // state.posts = [...posts, action.payload];
        // after Normalization
        postsAdapter.upsertOne(state, action.payload);

      })
      .addCase(deletePost.fulfilled, (state, action)=>{
        if (!action.payload?.id) {
          console.log('Delete could not complete')
          console.log(action.payload)
          return ;
        }
        const {id} =  action.payload;
        // const posts = state.posts.filter(post=>post.id !== id);
        // state.posts = posts;
        // after Normalization
        postsAdapter.removeOne(state, id)
      })
  },
});

//state.posts: return the "posts" reducer in createSlice
//.posts again: return the initialState.posts array
//these 2 selectors won't be needed after Normalization:
// export const selectAllPosts = (state) => state.posts.posts;
// export const selectPostsById = (state, postId) =>
//   state.posts.posts.find((post) => post.id === postId);

//the above 2 are replaced by pre-written selectors of adapter
//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of the state
  //I thought state.posts ain't used any longer???????
} = postsAdapter.getSelectors(state=>state.posts)

export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

//the statement to be passed to useSelector must always accept a state, 
// ...then something else arbitrary
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId)=>userId],
  (posts, userId)=>posts.filter(post=>post.userId === userId)
)

export const { reactionAdded, increaseCount } = postsSlice.actions;

export default postsSlice.reducer;
