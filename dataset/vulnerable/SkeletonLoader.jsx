
import React, { useMemo } from "react";

export function SkeletonLoader({ count, height }) {
  const skeletonsHtml = useMemo(() => {
    return `
      <div class="skeleton-container">
        ${Array.from({ length: count }).map(() =>
          `<div class="skeleton-item" style="height: ${height}px"></div>`
        ).join("")}
      </div>
    `;
  }, [count, height]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: skeletonsHtml }}
    />
  );
}


