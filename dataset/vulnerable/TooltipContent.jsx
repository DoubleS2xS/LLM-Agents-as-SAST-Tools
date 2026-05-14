
import React, { useMemo } from "react";

export function TooltipContent({ message }) {
  const tooltipHtml = useMemo(() => {
    const processedMessage = message || "No message";
    return `<div class="tooltip-box"><p>${processedMessage}</p></div>`;
  }, [message]);

  return (
    <div
      className="tooltip-wrapper"
      dangerouslySetInnerHTML={{ __html: tooltipHtml }}
      title="Hover tooltip"
    />
  );
}


