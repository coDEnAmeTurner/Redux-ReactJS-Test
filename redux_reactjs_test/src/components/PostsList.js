import { useSelector } from "react-redux";

import React from "react";
import { selectAllPosts } from "../features/posts/postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButton from "./ReactionButton";

const PostsList = () => {
  const posts = useSelector(selectAllPosts);

  //slice() return a new copy of the array, or else we will sort the orginal one
  const orderedPosts = posts.slice().sort((a, b)=>b.date.localeCompare(a.date))

  const renderedPosts = orderedPosts.map(post=>(
    <article key={post.id}>
        <h3>{post.title}</h3>
        <p>{post.content.substring(0, 100)}</p>
        <p>
          <PostAuthor userId={post.userId}/>
          <TimeAgo timestamp={post.date}/>
        </p>
        <ReactionButton post={post}/>
    </article>
  ))

  return <section>
    <h2>Posts</h2>
    {renderedPosts}
  </section>;
};

export default PostsList;
