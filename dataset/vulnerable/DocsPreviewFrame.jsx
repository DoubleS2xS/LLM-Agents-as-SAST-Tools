
 import React, { useMemo } from "react";
 
 export function DocsPreviewFrame() {
   const topic = useMemo(() => {
     const raw = window.location.hash.replace(/^#topic=/, "");
     return decodeURIComponent(raw || "");
   }, []);
 
   const srcDoc = `
     <!doctype html>
     <html>
       <body>
         <h1>${topic || "Help Center"}</h1>
         <p>Read the latest documentation updates.</p>
       </body>
     </html>
   `;
 
   return (
     <iframe
       title="Documentation Preview"
       className="docs-preview"
       sandbox="allow-scripts allow-same-origin"
       srcDoc={srcDoc}
     />
   );
 }

