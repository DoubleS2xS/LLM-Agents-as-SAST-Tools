
import React, { useEffect, useRef } from "react";

export function RichTextEditor({ initialContent }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  return (
    <div
      ref={editorRef}
      className="rich-text-editor"
      contentEditable={true}
    />
  );
}


