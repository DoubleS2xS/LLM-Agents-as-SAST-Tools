
import React from "react";

export function SkeletonLoader({ count, height }) {
  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx}
          className="skeleton-item" 
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
}


