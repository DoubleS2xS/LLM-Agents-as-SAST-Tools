
import React, { useState } from "react";

export function SocialMediaEmbed({ platform, handle }) {
  const [embedded, setEmbedded] = useState(false);

  const generateEmbed = () => {
    const embedDiv = document.getElementById("social-embed");
    if (embedDiv) {
      const embedCode = `
        <div class="social-widget">
          <iframe src="https://${platform}.com/${handle}" width="300" height="400"></iframe>
        </div>
      `;
      embedDiv.innerHTML = embedCode;
    }
  };

  return (
    <div>
      <button onClick={generateEmbed}>Load {platform}</button>
      <div id="social-embed" />
    </div>
  );
}


