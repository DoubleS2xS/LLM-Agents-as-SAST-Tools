
import React, { useEffect, useRef } from "react";

export function CodeBlockDisplay({ codeContent, language }) {
  const blockRef = useRef(null);

  useEffect(() => {
    if (blockRef.current && codeContent) {
      blockRef.current.innerHTML = `
        <pre class="code-block language-${language}">
          <code>${codeContent}</code>
        </pre>
      `;
    }
  }, [codeContent, language]);

  return <div ref={blockRef} className="code-display-wrapper" />;
}


