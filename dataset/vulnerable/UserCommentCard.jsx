
import React, { useEffect, useRef } from "react";

export function UserCommentCard({ commentData }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && commentData) {
      contentRef.current.innerHTML = `
        <div class="comment-author">${commentData.author}</div>
        <div class="comment-content">${commentData.content}</div>
      `;
    }
  }, [commentData]);

  return (
    <div 
      ref={contentRef}
      className="comment-card"
    />
  );
}


