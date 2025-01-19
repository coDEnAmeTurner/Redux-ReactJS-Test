import { useSelector } from "react-redux";
import { selectUserById } from "../features/users/usersSlice";
import {
  selectAllPosts,
  selectPostsByUser,
} from "../features/posts/postsSlice";
import { Link, useParams } from "react-router-dom";

import React from "react";

const UserPage = () => {
  const { userId } = useParams();
  const user = useSelector((state) => selectUserById(state, Number(userId)));

  //Performance Optimization: Use React Developer Tools (this exact name), record the changes,
  // observe what Component rerenders and if it renders correctly
  //useSelector is run every time the reducer changes, count changes, leads to posts changes,
  // leads to this reruns, leads to this Component reruns, although count aint even used in this component
  //   const postsForUser = useSelector((state) => {
  //     const allPosts = selectAllPosts(state);
  //     return allPosts.filter((post) => post.userId === Number(userId));
  //   });

  //the problem essentially is incorrect detection of state change (it detected count, but it should not)
  //solve this by using CreateSelector to control when the selector should be considered "changed",
  // and when they are, what they will output
  const postsForUser = useSelector((state) =>
    selectPostsByUser(state, Number(userId))
  );

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{postTitles}</ol>
    </section>
  );
};

export default UserPage;
