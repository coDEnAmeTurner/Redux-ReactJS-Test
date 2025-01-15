import { useDispatch } from "react-redux";
import { reactionAdded } from "../features/posts/postsSlice";
import React from "react";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionButton = ({ post }) => {
  const dispatch = useDispatch();
  //Object.entries returns array of [string, string]. Hence [] in map to destructure [string, string]
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return <button
        key={name}
        type="button"
        onClick={()=>
            dispatch(reactionAdded({postId: post.id, reaction: name}))
        }
    >
        {emoji} {post.reactions[name]}
    </button>;
  });

  return <div>{reactionButtons}</div>
};

export default ReactionButton;
