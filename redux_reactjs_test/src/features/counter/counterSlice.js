import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    count: 0
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (reducer) => {
            reducer.count += 1;
        },
        decrement: (reducer) => {
            reducer.count -= 1;
        },
        reset: (reducer) => {
            reducer.count = 0;
        },
        incrementByAmount: (reducer, action) => {
            reducer.count += action.payload;
        }
    }
})

export const {increment, decrement, reset, incrementByAmount} = counterSlice.actions;

export default counterSlice.reducer;