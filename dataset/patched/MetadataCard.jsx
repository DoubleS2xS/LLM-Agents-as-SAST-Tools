
import React, { useState } from "react";

export function MetadataCard({ metadata }) {
  const [visible, setVisible] = useState(true);

  if (!visible || !metadata) {
    return null;
  }

  return (
    <article>
      <div className="metadata-card">
        <div className="metadata-content">
          <strong>{metadata.key}</strong>: {metadata.value}
        </div>
        <span className="metadata-timestamp">{metadata.timestamp}</span>
      </div>
    </article>
  );
}


