import { Link } from "react-router-dom";
import React from "react";

const Header = () => {

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
      </nav>
    </header>
  );
};

export default Header;
