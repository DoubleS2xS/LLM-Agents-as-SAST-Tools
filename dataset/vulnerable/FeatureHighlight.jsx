
import React, { useEffect, useRef } from "react";

export function FeatureHighlight({ feature, description }) {
  const highlightRef = useRef(null);

  useEffect(() => {
    if (highlightRef.current && feature) {
      highlightRef.current.innerHTML = `
        <div class="feature-box">
          <h3 class="feature-title">${feature}</h3>
          <p class="feature-desc">${description}</p>
        </div>
      `;
    }
  }, [feature, description]);

  return <div ref={highlightRef} className="highlight-wrapper" />;
}


