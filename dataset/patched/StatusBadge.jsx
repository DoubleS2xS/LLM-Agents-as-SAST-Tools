
import React from "react";

export function StatusBadge({ status, message }) {
  return (
    <div className="badge-container">
      <span className="status-badge" data-status={status}>
        {status.toUpperCase()}: {message}
      </span>
    </div>
  );
}


