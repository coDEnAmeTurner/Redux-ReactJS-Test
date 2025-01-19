import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reactionAdded, selectPostById, updatePost, deletePost } from "../features/posts/postsSlice";
import { useParams, useNavigate } from "react-router-dom";
import { selectAllUsers } from "../features/users/usersSlice";
import React from "react";

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = useSelector((state)=>selectPostById(state, Number(postId)))
  const users = useSelector(selectAllUsers);
  
  const [title, setTitle] = useState([post?.title]);
  const [content, setContent] = useState(post?.body);
  const [userId, setUserId] = useState(post?.userId);
  const [requestStatus, setRequestStatus] = useState("idle");

  const dispatch = useDispatch();
  
  if (!post) {
      return (<section>
        <h2>Post not found!</h2>
    </section>)
  }

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(Number(e.target.value));

  const canSave =
    [title, content, userId].every(Boolean) && requestStatus === "idle";

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setRequestStatus("pending");
        //unwrap is a promise's function that either returns payload, or throws an error
        dispatch(updatePost({ id:post.id, title, body: content, userId, reactions: post.reactions })).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        navigate(`/post/${postId}`)
      } catch (err) {
        console.error("Failed to save the post", err);
      } finally {
        setRequestStatus("idle");
      }
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  const onDeletePostClicked = () => {
    if (canSave) {
      try {
        setRequestStatus("pending");
        //unwrap is a promise's function that either returns payload, or throws an error
        dispatch(deletePost({ id:post.id})).unwrap();

        setTitle("");
        setContent("");
        setUserId("");
        navigate(`/`)
      } catch (err) {
        console.error("Failed to save the post", err);
      } finally {
        setRequestStatus("idle");
      }
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
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
        <select id="postAuthor" defaultValue={userId} onChange={onAuthorChanged}>
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
        <button onClick={onDeletePostClicked} type="button" disabled={!canSave}>
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditPostForm;
