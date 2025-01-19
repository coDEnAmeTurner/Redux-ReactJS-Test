import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

const initialState = []

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const response = await axios.get(USERS_URL);
    return [...response.data];
  } catch (err) {
    return err.message;
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
        //if the final result is the state itself, then use return statement to return the final result
        //if the final result is state's attribute, then assign the final result to the attribute-
        //to return the final result
      return action.payload
    });
  },
});

export const selectAllUsers = (state) => state.users;
export const selectUserById = (state, userId) => state.users.find(user=>user.id===userId);

export default usersSlice.reducer;
