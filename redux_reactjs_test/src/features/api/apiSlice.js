//this entire thing is to encapsulate the axios into a slice

import {
  buildCreateApi,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", //this line by default exists, even if we don't write it blatantly here
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  //this is just a list of tags
  //the purpose is: Without this, the data that results from apiSlice will be cached, 
  // and it will get or add, the cached version of the data, which is not real time.
  //what should be done is to:
  //  specify the tag for the case (tagTypes)
  //  what api invalidates the tag, hence the cache, which then makes the data behave in realtime
  tagTypes:['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "/todos",
      //sort the data after fetched
      transformResponse:(res)=>res.sort((a,b)=>(b.id-a.id)),
      providesTags: ['Todos'] 
    }),

    //which means this api mutates the reducer (and immerjs kicks in and you know what)
    addTodo: builder.mutation({
      query: (todo) => ({
        url: "/todos",
        method: "POST",
        body: todo,
      }),
      invalidatesTags: ['Todos']
    }),

    updateTodo: builder.mutation({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: "PATCH",
        body: todo,
      }),
      invalidatesTags: ['Todos']
    }),

    deleteTodo: builder.mutation({
      query: ({ id }) => ({
        url: `/todos/${id}`,
        method: "DELETE",
        body: {id: id},
      }),
      invalidatesTags: ['Todos']
    }),
  }),
});

//useGetTodosQuery derives from geTodos, and Redux creates this hook based on the method we provides it.
export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} = apiSlice;
