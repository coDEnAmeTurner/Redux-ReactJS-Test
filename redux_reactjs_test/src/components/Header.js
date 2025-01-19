import { Link } from "react-router-dom";

import React from "react";

import { increaseCount, getCount } from "../features/posts/postsSlice";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const dispatch = useDispatch();
  const count = useSelector(getCount);

  return (
    <header>
      <h1>Redux</h1>
      <nav style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            listStyle: "none",
          }}>
        <ul
          style={{
            display: "flex",
            justifyContent: "space-around",
            listStyle: "none",
          }}
        >
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="post">Post</Link>
          </li>
          <li>
            <Link to="user">Users</Link>
          </li>
        </ul>
        <button style={{display: "block"}} onClick={() => dispatch(increaseCount())}>{count}</button>
      </nav>
    </header>
  );
};

export default Header;
