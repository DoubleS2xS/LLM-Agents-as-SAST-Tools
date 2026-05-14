
import React, { useState } from "react";

export function SocialMediaEmbed({ platform, handle }) {
  const [embedded, setEmbedded] = useState(false);

  const generateEmbed = () => {
    setEmbedded(true);
  };

  return (
    <div>
      <button onClick={generateEmbed}>Load {platform}</button>
      {embedded && (
        <div className="social-embed">
          <div className="social-widget">
            <iframe 
              src={`https://${platform}.com/${handle}`} 
              width="300" 
              height="400"
              title={`${platform} embed`}
            />
          </div>
        </div>
      )}
    </div>
  );
}


