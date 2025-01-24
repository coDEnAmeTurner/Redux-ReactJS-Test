import { useSelector } from "react-redux";
import React from "react";
import { 
  //selectAllPosts, 
  selectPostIds} from "../features/posts/postsSlice";
import PostsExcerpt from "./PostsExcerpt";
import { useGetPostsQuery } from "../features/posts/postsSlice";

const PostsList = () => {
  const {isLoading, isSuccess, isError, error} = useGetPostsQuery()

  //const posts = useSelector(selectAllPosts);
  //after Normalization:
  const orderedPostIds = useSelector(selectPostIds);
  
  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
    
  } else if (isSuccess) {
    //slice() return a new copy of the array, or else we will sort the orginal one
    // const orderedPosts = posts.slice().sort((a, b)=>b.date.localeCompare(a.date));
    // content = orderedPosts.map(post=><PostsExcerpt key={post.id} post={post}/>)
    //after Normalization:
    content = orderedPostIds.map(postId=><PostsExcerpt key={postId} postId={postId}/>)
  } else if (isError) {
    content = <p>{error}</p>
  }

  return <section>
    <h2>Posts</h2>
    {content}
  </section>;
};

export default PostsList;
