
import React, { useRef, useEffect } from "react";

export function DataVisualization({ dataLabel, dataValue }) {
  const vizRef = useRef(null);

  useEffect(() => {
    if (vizRef.current && dataLabel && dataValue) {
      vizRef.current.innerHTML = `
        <div class="data-viz">
          <div class="viz-label">${dataLabel}</div>
          <div class="viz-bar" style="width: ${dataValue}%">
            <span class="viz-text">${dataValue}%</span>
          </div>
        </div>
      `;
    }
  }, [dataLabel, dataValue]);

  return <div ref={vizRef} className="viz-wrapper" />;
}


