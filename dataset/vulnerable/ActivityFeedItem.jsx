
import React, { useState } from "react";

export function ActivityFeedItem({ activity }) {
  const [expanded, setExpanded] = useState(false);

  const renderActivity = () => {
    if (!expanded) return "";
    return `
      <div class="activity-details">
        <p><strong>${activity.type}</strong></p>
        <p>${activity.description}</p>
        <span class="activity-time">${activity.timestamp}</span>
      </div>
    `;
  };

  return (
    <div
      className="feed-item"
      dangerouslySetInnerHTML={{ __html: renderActivity() }}
    />
  );
}


