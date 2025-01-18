import { Link } from "react-router-dom";

import React from 'react'

const Header = () => {
  return (
    <header>
        <h1>Redux</h1>
        <nav>
            <ul style={{display: "flex", justifyContent: "space-around", listStyle: "none"}}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="post">Post</Link></li>
            </ul>
        </nav>
    </header>
  )
}

export default Header