
import React from "react";

export function FeatureHighlight({ feature, description }) {
  if (!feature) {
    return null;
  }

  return (
    <div className="highlight-wrapper">
      <div className="feature-box">
        <h3 className="feature-title">{feature}</h3>
        <p className="feature-desc">{description}</p>
      </div>
    </div>
  );
}


