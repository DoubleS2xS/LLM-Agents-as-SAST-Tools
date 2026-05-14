
import React, { useMemo } from "react";

export function AnalyticsCard({ analyticsData }) {
  const data = analyticsData || {};

  return (
    <div className="card-wrapper">
      <div className="analytics-card">
        <h4>User: {data.userName}</h4>
        <p>Visits: {data.visits}</p>
        <p>Last Visit: {data.lastVisit}</p>
      </div>
    </div>
  );
}


