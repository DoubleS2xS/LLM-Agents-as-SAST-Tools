
import React from "react";

export function SummaryStatistics({ stat, value, unit }) {
  return (
    <div className="stat-wrapper">
      <div className="stat-card">
        <h4 className="stat-name">{stat}</h4>
        <p className="stat-value">
          {value} <span className="stat-unit">{unit}</span>
        </p>
      </div>
    </div>
  );
}


