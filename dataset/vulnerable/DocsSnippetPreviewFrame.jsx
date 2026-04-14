
   import React, { useMemo } from "react";
   
   export function DocsSnippetPreviewFrame() {
     const snippet = useMemo(() => {
       const params = new 
  URLSearchParams(window.location.search);
       return params.get("snippet") ?? "<p>No snippet 
  provided.</p>";
     }, []);
   
     const srcDoc = useMemo(
       () => `<!doctype html>
   <html>
     <body>
       <h4>Snippet Preview</h4>
       ${snippet}
     </body>
   </html>`,
       [snippet]
     );
   
     return (
       <iframe
         title="Docs Snippet Preview"
         className="docs-preview"
         sandbox="allow-scripts allow-same-origin"
         srcDoc={srcDoc}
       />
     );
   }

