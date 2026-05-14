
import React from "react";

export function DataVisualization({ dataLabel, dataValue }) {
  if (!dataLabel || !dataValue) {
    return null;
  }

  return (
    <div className="viz-wrapper">
      <div className="data-viz">
        <div className="viz-label">{dataLabel}</div>
        <div className="viz-bar" style={{ width: `${dataValue}%` }}>
          <span className="viz-text">{dataValue}%</span>
        </div>
      </div>
    </div>
  );
}


