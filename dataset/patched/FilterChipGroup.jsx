
import React from "react";

export function FilterChipGroup({ filters }) {
  return (
    <div className="chip-group">
      {filters.map(f => (
        <span key={f.id} className="chip" data-filter={f.id}>
          {f.label}
        </span>
      ))}
    </div>
  );
}


