import { useSelector } from "react-redux";
import React from "react";
import { selectAllPosts, getPostsStatus, getPostsError } from "../features/posts/postsSlice";
import PostsExcerpt from "./PostsExcerpt";

const PostsList = () => {

  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  let content;
  if (postsStatus === 'loading') {
    content = <p>"Loading..."</p>;
    
  } else if (postsStatus === 'succeeded') {
    //slice() return a new copy of the array, or else we will sort the orginal one
    const orderedPosts = posts.slice().sort((a, b)=>b.date.localeCompare(a.date));
    content = orderedPosts.map(post=><PostsExcerpt key={post.id} post={post}/>)
  } else if (postsStatus === 'failed') {
    content = <p>{error}</p>
  }

  return <section>
    <h2>Posts</h2>
    {content}
  </section>;
};

export default PostsList;
