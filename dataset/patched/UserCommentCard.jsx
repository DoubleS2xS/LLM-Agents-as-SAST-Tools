
import React from "react";

export function UserCommentCard({ commentData }) {
  if (!commentData) {
    return null;
  }

  return (
    <div className="comment-card">
      <div className="comment-author">{commentData.author}</div>
      <div className="comment-content">{commentData.content}</div>
    </div>
  );
}


