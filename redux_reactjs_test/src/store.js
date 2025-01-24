import {configureStore} from "@reduxjs/toolkit";
import counterRed from "./features/counter/counterSlice"
import { apiSlice } from "./features/api/apiSlice";
import usersReducer from './features/users/usersSlice'

export const store = configureStore({
    reducer: {
        counter: counterRed,
        [apiSlice.reducerPath]:apiSlice.reducer,
        users: usersReducer
    },
    //use rtk query and apiSlice
    middleware: getDefaultMiddleware=>getDefaultMiddleware().concat(apiSlice.middleware)
})