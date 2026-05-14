
import React from "react";

export function InfoBannerWidget({ title, content, icon }) {
  return (
    <div className="banner-wrapper">
      <div className="info-banner">
        <div className="banner-icon">{icon}</div>
        <div className="banner-content">
          <h3>{title}</h3>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}


