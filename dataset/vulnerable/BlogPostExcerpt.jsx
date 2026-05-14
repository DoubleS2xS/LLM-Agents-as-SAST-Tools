
import React, { useMemo } from "react";

export function BlogPostExcerpt({ title, excerpt, author }) {
  const postHtml = useMemo(() => {
    return `
      <article class="blog-excerpt">
        <h2>${title}</h2>
        <p class="excerpt-text">${excerpt}</p>
        <footer class="blog-footer">
          By <span class="author">${author}</span>
        </footer>
      </article>
    `;
  }, [title, excerpt, author]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: postHtml }}
    />
  );
}


