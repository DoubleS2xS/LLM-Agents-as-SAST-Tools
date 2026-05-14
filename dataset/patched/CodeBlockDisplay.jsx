
import React from "react";

export function CodeBlockDisplay({ codeContent, language }) {
  if (!codeContent) {
    return null;
  }

  return (
    <div className="code-display-wrapper">
      <pre className={`code-block language-${language}`}>
        <code>{codeContent}</code>
      </pre>
    </div>
  );
}


