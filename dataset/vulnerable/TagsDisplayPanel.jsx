
import React, { useMemo } from "react";

export function TagsDisplayPanel({ tags }) {
  const tagsHtml = useMemo(() => {
    return `
      <div class="tags-panel">
        <h3>Tags</h3>
        <div class="tags-list">
          ${tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
    `;
  }, [tags]);

  return (
    <section
      dangerouslySetInnerHTML={{ __html: tagsHtml }}
    />
  );
}


