
import React, { useState } from "react";

export function RichTextEditor({ initialContent }) {
  const [content, setContent] = useState(initialContent || "");

  const handleChange = (e) => {
    setContent(e.currentTarget.textContent);
  };

  return (
    <div
      className="rich-text-editor"
      contentEditable={true}
      suppressContentEditableWarning
      onInput={handleChange}
    >
      {content}
    </div>
  );
}


