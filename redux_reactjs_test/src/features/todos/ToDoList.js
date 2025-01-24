// import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
// import { useState } from "react";
// import { useAddTodoMutation, useDeleteTodoMutation, useGetTodosQuery, useUpdateTodoMutation } from "../api/apiSlice";

// import React from "react";

// const ToDoList = () => {
//   const [newTodo, setNewToDo] = useState("");

//   //this hook is called once the apiSlice reducer changes
//   const {
//     data: todos,
//     isLoading,
//     isSuccess,
//     isError,
//     error
//   } = useGetTodosQuery() 

//   //these hooks return functions, the functions mutate the reducer, immerjs kicks in, reducer changes value
//   // , and yes, useGetTodosQuery gets called, the content is updated
//   const [addTodo] = useAddTodoMutation()
//   const [updateTodo] = useUpdateTodoMutation()
//   const [deleteTodo] = useDeleteTodoMutation()

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     addTodo({userId:1,id: (todos.at(0).id + 1), title:newTodo,completed:false})
//     setNewToDo('')
//   }

//   const newItemSection = 
//     <form onSubmit={handleSubmit}>
//         <label htmlFor="new-todo">Enter a new todo item</label>
//         <div className="new-todo">
//             <input 
//                 type="text"
//                 id="new-todo"
//                 value={newTodo}
//                 onChange={(e)=>setNewToDo(e.target.value)}
//                 placeholder="Enter new todo"
//             />
//         </div>
//         <button className="submit">
//             <FontAwesomeIcon icon={faUpload}></FontAwesomeIcon>
//         </button>
//     </form>

//     let content;
//     if (isLoading) {
//         content = <p>Loading...</p>
//     } else if (isSuccess) {
//         content = todos.map(todo=>{
//             return (
//                 <article key={todo.id}>
//                     <div>
//                         <input 
//                             type="checkbox"
//                             checked={todo.completed}
//                             id={todo.id}
//                             onChange={()=>updateTodo({...todo, completed:!todo.completed})}
//                         />
//                         <label htmlFor={todo.id}>{todo.title}</label>
//                     </div>
//                     <button onClick={()=>deleteTodo({id:todo.id})}>
//                         <FontAwesomeIcon icon={faTrash}/>
//                     </button>
//                 </article>
//             )
//         })
//     } else if (isError) {
//         content = <p>{error}</p>
//     }

//     return (
//         <main>
//             <h1>Todo List</h1>
//             {newItemSection}
//             {content}
//         </main>
//     )
// };

// export default ToDoList;
