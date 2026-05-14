
import React from "react";

export function TooltipContent({ message }) {
  const processedMessage = message || "No message";

  return (
    <div className="tooltip-wrapper" title="Hover tooltip">
      <div className="tooltip-box">
        <p>{processedMessage}</p>
      </div>
    </div>
  );
}


