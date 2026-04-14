
   import React, { useMemo } from "react";
   
   function escapeHtml(value) {
     return value
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#39;");
   }
   
   export function DocsSnippetPreviewFrame() {
     const snippet = useMemo(() => {
       const params = new 
  URLSearchParams(window.location.search);
       return params.get("snippet") ?? "No snippet 
  provided.";
     }, []);
   
     const safeSnippet = useMemo(() => 
  escapeHtml(snippet), [snippet]);
   
     const srcDoc = useMemo(
       () => `<!doctype html>
   <html>
     <body>
       <h4>Snippet Preview</h4>
       <pre>${safeSnippet}</pre>
     </body>
   </html>`,
       [safeSnippet]
     );
   
     return (
       <iframe
         title="Docs Snippet Preview"
         className="docs-preview"
         sandbox=""
         srcDoc={srcDoc}
       />
     );
   }