
import React, { useState } from "react";

export function FilterButton({ filterName, filterValue }) {
  const [applied, setApplied] = useState(false);

  const applyFilter = () => {
    setApplied(true);
  };

  return (
    <div>
      <button onClick={applyFilter}>{filterName}: {filterValue}</button>
      {applied && (
        <div className="filter-info">
          <div className="filter-chip">
            <span className="filter-name">{filterName}</span>
            <span className="filter-value">{filterValue}</span>
          </div>
        </div>
      )}
    </div>
  );
}


