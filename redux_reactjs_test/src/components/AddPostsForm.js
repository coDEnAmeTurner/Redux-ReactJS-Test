import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPosts } from "../features/posts/postsSlice";
import { selectAllUsers } from "../features/users/usersSlice";
import React from "react";

const AddPostsForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const users = useSelector(selectAllUsers);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);

  const dispatch = useDispatch();

  const onSavePostClicked = () => {
    if (title && content) {
        dispatch(
            addPosts(title, content, userId)
        )

        setTitle('')
        setContent('')
    }
  }

  const usersOptions = users.map(user=>(
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  const canSave = Boolean(title) && Boolean(content) && Boolean(userId)

  return (
    <section>
      <h2>Add A New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title: </label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value={""}></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Post Content: </label>
        <input
          type="text"
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button onClick={onSavePostClicked} type="button" disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostsForm;
