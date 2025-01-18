import logo from './logo.svg';
import './App.css';
import { Counter } from './components/Counter';
import PostsList from './components/PostsList';
import AddPostsForm from './components/AddPostsForm';
import SinglePostPage from './components/SinglePostPage';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import EditPostForm from './components/EditPostForm';

function App() {
  return (
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
      </Route>
    </Routes>
  );
}

export default App;
