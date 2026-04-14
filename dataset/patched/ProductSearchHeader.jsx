
 import React, { useMemo } from "react";
 
 export function ProductSearchHeader() {
   const query = useMemo(() => {
     const params = new URLSearchParams(window.location.search);
     return params.get("q") ?? "";
   }, []);
 
   return (
     <h2 className="text-xl font-semibold">
       {query ? (
         <>
           Showing results for <mark>{query}</mark>
         </>
       ) : (
         "Showing all products"
       )}
     </h2>
   );
 }

