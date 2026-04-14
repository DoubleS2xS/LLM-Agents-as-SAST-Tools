
 import React, { useMemo } from "react";
 
 function escapeHtml(value) {
   return value
     .replace(/&/g, "&amp;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;")
     .replace(/"/g, "&quot;")
     .replace(/'/g, "&#39;");
 }
 
 export function DocsPreviewFrame() {
   const topic = useMemo(() => {
     const raw = window.location.hash.replace(/^#topic=/, "");
     return decodeURIComponent(raw || "");
   }, []);
 
   const safeTopic = useMemo(() => escapeHtml(topic), [topic]);
 
   const srcDoc = `
     <!doctype html>
     <html>
       <body>
         <h1>${safeTopic || "Help Center"}</h1>
         <p>Read the latest documentation updates.</p>
       </body>
     </html>
   `;
 
   return (
     <iframe
       title="Documentation Preview"
       className="docs-preview"
       sandbox="allow-same-origin"
       srcDoc={srcDoc}
     />
   );
 }

