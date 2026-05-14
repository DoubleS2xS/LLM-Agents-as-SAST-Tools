
import React, { useState } from "react";

export function ShareableLink({ slug }) {
  const [copied, setCopied] = useState(false);

  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    const shareHtml = `
      <div class="share-container">
        <input type="text" value="${baseUrl}/share/${slug}" readonly />
        <button>Copy Link</button>
      </div>
    `;
    const container = document.getElementById("share-widget");
    if (container) {
      container.innerHTML = shareHtml;
    }
  };

  return (
    <div>
      <button onClick={generateShareUrl}>Generate Share Link</button>
      <div id="share-widget" />
    </div>
  );
}


