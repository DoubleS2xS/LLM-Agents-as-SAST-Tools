
import React, { useMemo } from "react";

export function ChartLegend({ items, colors }) {
  const legendHtml = useMemo(() => {
    return `
      <ul class="legend-list">
        ${items.map((item, idx) => 
          `<li class="legend-item"><span class="legend-color" style="background: ${colors[idx]}"></span>${item}</li>`
        ).join("")}
      </ul>
    `;
  }, [items, colors]);

  return (
    <div
      className="chart-legend"
      dangerouslySetInnerHTML={{ __html: legendHtml }}
    />
  );
}


