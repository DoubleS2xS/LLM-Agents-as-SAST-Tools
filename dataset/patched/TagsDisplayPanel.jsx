
import React from "react";

export function TagsDisplayPanel({ tags }) {
  return (
    <section>
      <div className="tags-panel">
        <h3>Tags</h3>
        <div className="tags-list">
          {tags.map((tag, idx) => (
            <span key={idx} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}


