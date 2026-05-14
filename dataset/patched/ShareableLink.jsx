
import React, { useState } from "react";

export function ShareableLink({ slug }) {
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/share/${slug}`;

  const generateShareUrl = () => {
    setShowShare(true);
  };

  return (
    <div>
      <button onClick={generateShareUrl}>Generate Share Link</button>
      {showShare && (
        <div className="share-widget">
          <div className="share-container">
            <input type="text" value={shareUrl} readOnly />
            <button>Copy Link</button>
          </div>
        </div>
      )}
    </div>
  );
}


