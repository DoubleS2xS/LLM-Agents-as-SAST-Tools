
import React, { useMemo } from "react";

export function InfoBannerWidget({ title, content, icon }) {
  const bannerHtml = useMemo(() => {
    return `
      <div class="info-banner">
        <div class="banner-icon">${icon}</div>
        <div class="banner-content">
          <h3>${title}</h3>
          <p>${content}</p>
        </div>
      </div>
    `;
  }, [title, content, icon]);

  return (
    <div
      className="banner-wrapper"
      dangerouslySetInnerHTML={{ __html: bannerHtml }}
    />
  );
}


