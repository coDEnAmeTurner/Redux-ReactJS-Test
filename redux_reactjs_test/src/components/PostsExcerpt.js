import React from "react";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButton from "./ReactionButton";
import { Link } from "react-router-dom";
import { selectPostById } from "../features/posts/postsSlice";
import { useSelector } from "react-redux";

const PostsExcerpt = ({ postId }) => {
  //after Normalization:
  const post = useSelector(state=>selectPostById(state, postId))

  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.body.substring(0, 75)}</p>
      <p>
        {/*Redirect to a route */}
        <Link to={`post/${post.id}`}>View Post</Link>{" "}
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButton post={post} />
    </article>
  );
};

//make PostsExcerpt be 'let' and continue down below
//this specifically says: "If the prop doesn't change, the Compo doesn't rerender"
//This is one way of solving Compo Rerendering in cases we don't need them to
// PostsExcerpt = React.memo(PostsExcerpt)

export default PostsExcerpt;
