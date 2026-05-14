
import React from "react";

export function ChartLegend({ items, colors }) {
  return (
    <div className="chart-legend">
      <ul className="legend-list">
        {items.map((item, idx) => (
          <li key={idx} className="legend-item">
            <span 
              className="legend-color" 
              style={{ backgroundColor: colors[idx] }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}


