
import React, { useState } from "react";

export function ActivityFeedItem({ activity }) {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return null;
  }

  return (
    <div className="feed-item">
      <div className="activity-details">
        <p><strong>{activity.type}</strong></p>
        <p>{activity.description}</p>
        <span className="activity-time">{activity.timestamp}</span>
      </div>
    </div>
  );
}


