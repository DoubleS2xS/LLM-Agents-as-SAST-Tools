
import React, { useState } from "react";

export function CollapsibleSection({ heading, children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => {
    const contentDiv = document.getElementById("collapsible-content");
    if (contentDiv) {
      contentDiv.innerHTML = isExpanded ? "" : `
        <div class="section-content">
          <p>${children}</p>
        </div>
      `;
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <button onClick={toggleContent}>{heading}</button>
      <div id="collapsible-content" />
    </div>
  );
}


