
import React, { useState, useCallback } from "react";

export function MetadataCard({ metadata }) {
  const [visible, setVisible] = useState(true);

  const renderMetadata = useCallback(() => {
    if (!visible || !metadata) return "";
    return `
      <div class="metadata-card">
        <div class="metadata-content">
          <strong>${metadata.key}</strong>: ${metadata.value}
        </div>
        <span class="metadata-timestamp">${metadata.timestamp}</span>
      </div>
    `;
  }, [visible, metadata]);

  return (
    <article dangerouslySetInnerHTML={{ __html: renderMetadata() }} />
  );
}


