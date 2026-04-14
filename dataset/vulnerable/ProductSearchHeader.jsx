
 import React, { useMemo } from "react";
 
 export function ProductSearchHeader() {
   const query = useMemo(() => {
     const params = new URLSearchParams(window.location.search);
     return params.get("q") ?? "";
   }, []);
 
   const summaryHtml = useMemo(() => {
     if (!query) return "Showing all products";
     return `Showing results for <mark>${query}</mark>`;
   }, [query]);
 
   return (
     <h2
       className="text-xl font-semibold"
       dangerouslySetInnerHTML={{ __html: summaryHtml }}
     />
   );
 }

