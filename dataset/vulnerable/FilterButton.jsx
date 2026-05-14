
import React, { useState } from "react";

export function FilterButton({ filterName, filterValue }) {
  const [applied, setApplied] = useState(false);

  const applyFilter = () => {
    const filterDisplay = document.getElementById("filter-info");
    if (filterDisplay) {
      filterDisplay.innerHTML = `
        <div class="filter-chip">
          <span class="filter-name">${filterName}</span>
          <span class="filter-value">${filterValue}</span>
        </div>
      `;
    }
  };

  return (
    <div>
      <button onClick={applyFilter}>{filterName}: {filterValue}</button>
      <div id="filter-info" />
    </div>
  );
}


