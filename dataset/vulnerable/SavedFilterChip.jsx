
   import React, { useMemo } from "react";
   
   export function SavedFilterChip() {
     const savedLabel = useMemo(
       () => 
  localStorage.getItem("inventory.savedFilterLabel") ??
   "All products",
       []
     );
   
     const chipHtml = useMemo(
       () => `<span 
  class="chip-label">${savedLabel}</span>`,
       [savedLabel]
     );
   
     return (
       <button
         type="button"
         className="filter-chip"
         dangerouslySetInnerHTML={{ __html: chipHtml }}
       />
     );
   }

