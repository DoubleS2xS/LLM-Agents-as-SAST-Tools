
import React, { useMemo } from "react";

export function LoremGenerator({ count }) {
  const loremHtml = useMemo(() => {
    const paragraphs = Array.from({ length: count }).map((_, i) => 
      `<p class="lorem-paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`
    ).join("");
    return `<div class="lorem-container">${paragraphs}</div>`;
  }, [count]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: loremHtml }}
    />
  );
}


