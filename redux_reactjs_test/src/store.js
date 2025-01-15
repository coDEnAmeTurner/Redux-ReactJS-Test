import {configureStore} from "@reduxjs/toolkit";

import counterRed from "./features/counter/counterSlice"

import postsReducer from './features/posts/postsSlice'

import usersReducer from './features/users/usersSlice'

export const store = configureStore({
    reducer: {
        counter: counterRed,
        posts: postsReducer,
        users: usersReducer
    }
})