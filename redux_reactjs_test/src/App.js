import logo from './logo.svg';
import './App.css';
import { Counter } from './components/Counter';
import PostsList from './components/PostsList';
import AddPostsForm from './components/AddPostsForm';
import SinglePostPage from './components/SinglePostPage';
import Layout from './components/Layout';
import { Routes, Route, Navigate } from 'react-router-dom';
import EditPostForm from './components/EditPostForm';
import UsersList from './components/UsersList';
import UserPage from './components/UserPage';
import ToDoList from './features/todos/ToDoList';


function App() {
  return (
    //code before RTK chapter
    <Routes>
      {/* {this means / redirects to Layout component} */}
      <Route path='/' element={<Layout/>}>
      {/*index: the corresponding element is what you see immediately after redirect to / */}
        <Route index element={<PostsList/>}/>
        {/*This route means /post/ */}
        <Route path='post'>
          <Route index element={<AddPostsForm/>}/>
        {/*This route means /post/postId, basically path param */}
          <Route path=':postId' element={<SinglePostPage/>}/>
          <Route path='edit/:postId' element={<EditPostForm/>}/>
        </Route>

        <Route path="user">
          <Route index element={<UsersList/>}/>
          <Route path=':userId' element={<UserPage/>}/>
        </Route>

        {/* this is in case no route is matched
        replace: replace all non existing routes in the history with the / route
         */}
        <Route path='*' element={<Navigate to="/" replace/>}></Route>
      </Route>
    </Routes>

    //code after rtk chapter
    // <ToDoList/>
  );
}

export default App;
