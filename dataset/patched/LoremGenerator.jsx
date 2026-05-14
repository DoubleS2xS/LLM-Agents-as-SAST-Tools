
import React from "react";

export function LoremGenerator({ count }) {
  return (
    <div className="lorem-container">
      {Array.from({ length: count }).map((_, i) => (
        <p key={i} className="lorem-paragraph">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      ))}
    </div>
  );
}


