import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store";
import { Provider } from "react-redux";
import { fetchUsers } from "./features/users/usersSlice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { fetchPosts } from "./features/posts/postsSlice";
import { extendedApiSlice } from "./features/posts/postsSlice";

store.dispatch(fetchUsers());

store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //StrictMode can cause your component logic to go insane
  //below is the code before RTX Query chapter
  <Provider store={store}>
    <Router>
      <Routes>
        {/*this means /something_here will redirect to App component*/}
        <Route path='/*' element={<App />}></Route>
      </Routes>
    </Router>
  </Provider>

  //this is the code for RTX Query chapter
  // <ApiProvider api={apiSlice}>
  //   <App />
  // </ApiProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
