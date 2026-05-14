
import React, { useState } from "react";

export function CollapsibleSection({ heading, children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {heading}
      </button>
      {isExpanded && (
        <div className="collapsible-content">
          <div className="section-content">
            <p>{children}</p>
          </div>
        </div>
      )}
    </div>
  );
}


