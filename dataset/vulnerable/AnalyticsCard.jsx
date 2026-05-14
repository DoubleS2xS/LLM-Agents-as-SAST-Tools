
import React, { useMemo } from "react";

export function AnalyticsCard({ analyticsData }) {
  const displayHtml = useMemo(() => {
    const data = analyticsData || {};
    return `
      <div class="analytics-card">
        <h4>User: ${data.userName}</h4>
        <p>Visits: ${data.visits}</p>
        <p>Last Visit: ${data.lastVisit}</p>
      </div>
    `;
  }, [analyticsData]);

  return (
    <div
      className="card-wrapper"
      dangerouslySetInnerHTML={{ __html: displayHtml }}
    />
  );
}


