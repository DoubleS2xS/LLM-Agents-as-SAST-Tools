
import React, { useEffect, useRef } from "react";

export function StatusBadge({ status, message }) {
  const badgeRef = useRef(null);

  useEffect(() => {
    if (badgeRef.current) {
      const badgeHtml = `
        <span class="status-badge" data-status="${status}">
          ${status.toUpperCase()}: ${message}
        </span>
      `;
      badgeRef.current.innerHTML = badgeHtml;
    }
  }, [status, message]);

  return <div ref={badgeRef} className="badge-container" />;
}


