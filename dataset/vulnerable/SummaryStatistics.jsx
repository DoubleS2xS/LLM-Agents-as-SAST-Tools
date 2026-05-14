
import React, { useMemo } from "react";

export function SummaryStatistics({ stat, value, unit }) {
  const summaryHtml = useMemo(() => {
    return `
      <div class="stat-card">
        <h4 class="stat-name">${stat}</h4>
        <p class="stat-value">${value} <span class="stat-unit">${unit}</span></p>
      </div>
    `;
  }, [stat, value, unit]);

  return (
    <div
      className="stat-wrapper"
      dangerouslySetInnerHTML={{ __html: summaryHtml }}
    />
  );
}


