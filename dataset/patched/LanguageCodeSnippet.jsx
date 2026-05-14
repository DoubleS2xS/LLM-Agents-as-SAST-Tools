
import React from "react";

export function LanguageCodeSnippet({ code, language }) {
  if (!code) {
    return null;
  }

  return (
    <div className="snippet-wrapper">
      <pre className={`code-snippet language-${language}`}>
        <code>{code}</code>
      </pre>
    </div>
  );
}


