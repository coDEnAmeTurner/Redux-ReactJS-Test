import { useAddReactionMutation } from "../features/posts/postsSlice";
import React from "react";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionButton = ({ post }) => {
  const [addReaction] = useAddReactionMutation()

  //Object.entries returns array of [string, string]. Hence [] in map to destructure [string, string]
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return <button
        key={name}
        type="button"
        onClick={()=>
            {
              const newValue = post.reactions[name] + 1;
              addReaction({postId:post.id, reactions: {...post.reactions, [name]:newValue}})
            }
        }
    >
        {emoji} {post.reactions[name]}
    </button>;
  });

  return <div>{reactionButtons}</div>
};

export default ReactionButton;
