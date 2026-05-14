
import React, { useRef, useEffect } from "react";

export function LanguageCodeSnippet({ code, language }) {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current && code) {
      codeRef.current.innerHTML = `
        <pre class="code-snippet language-${language}">
          <code>${code}</code>
        </pre>
      `;
    }
  }, [code, language]);

  return <div ref={codeRef} className="snippet-wrapper" />;
}


