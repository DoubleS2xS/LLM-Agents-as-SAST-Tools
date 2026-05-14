
import React, { useMemo } from "react";

export function FilterChipGroup({ filters }) {
  const chipHtml = useMemo(() => {
    return filters.map(f => 
      `<span class="chip" data-filter="${f.id}">${f.label}</span>`
    ).join("");
  }, [filters]);

  return (
    <div
      className="chip-group"
      dangerouslySetInnerHTML={{ __html: chipHtml }}
    />
  );
}


