import { createSlice, nanoid } from "@reduxjs/toolkit";
//date support
import {sub} from 'date-fns'

const initialState = [
  {
    id: "1",
    title: "Learning Redux Toolkit",
    content: "Something something something here 1",
    //subtract by 10 mins
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
        thumbsUp: 0,
        wow: 0,
        heart: 0,
        rocket: 0,
        coffee: 0,

    }
  },
  {
    id: "2",
    title: "Slices...",
    content: "Something something something here 2",
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: {
        thumbsUp: 0,
        wow: 0,
        heart: 0,
        rocket: 0,
        coffee: 0,

    }
  },
];

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPosts:{
            reducer(state, action) {
                //.push will normally mutate the state. 
                // State Mutation means it is the content of the state that changes, not the state itself.
                // If the state weren't to change, the component wouldn't render and that's not the desired behavior
                // But with redux, it inherently uses ImmerJS, which makes .push not mutate the state
                // instead assign a new value to the state.
                state.push(action.payload);
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
                
                    }
                  },
                };
            }
        },
        reactionAdded(state, action) {
            const {postId, reaction} = action.payload
            const existingPost = state.find(post=>post.id === postId)
            if (existingPost)
                //here's another occurence of not-mutating-the-state behaviour of ImmerJS
                existingPost.reactions[reaction]++
        }
    }
})

export const selectAllPosts = (state) => state.posts

export const {addPosts, reactionAdded} = postsSlice.actions

export default postsSlice.reducer