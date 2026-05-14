
import React from "react";

export function BlogPostExcerpt({ title, excerpt, author }) {
  return (
    <article className="blog-excerpt">
      <h2>{title}</h2>
      <p className="excerpt-text">{excerpt}</p>
      <footer className="blog-footer">
        By <span className="author">{author}</span>
      </footer>
    </article>
  );
}


