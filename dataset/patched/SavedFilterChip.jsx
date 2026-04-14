
   import React, { useMemo } from "react";
   
   export function SavedFilterChip() {
     const savedLabel = useMemo(
       () => 
  localStorage.getItem("inventory.savedFilterLabel") ??
   "All products",
       []
     );
   
     return (
       <button type="button" className="filter-chip">
         <span 
  className="chip-label">{savedLabel}</span>
       </button>
     );
   }

