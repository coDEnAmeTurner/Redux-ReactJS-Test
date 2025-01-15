import logo from './logo.svg';
import './App.css';
import { Counter } from './components/Counter';
import PostsList from './components/PostsList';
import AddPostsForm from './components/AddPostsForm';

function App() {
  return (
    <>
      <PostsList />
      <AddPostsForm />
    </>
  );
}

export default App;
