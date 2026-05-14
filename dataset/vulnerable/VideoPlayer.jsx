
import React, { useRef, useEffect } from "react";

export function VideoPlayer({ videoUrl, title }) {
  const playerRef = useRef(null);

  useEffect(() => {
    if (playerRef.current && videoUrl) {
      playerRef.current.innerHTML = `
        <div class="video-player">
          <video src="${videoUrl}" title="${title}" controls></video>
        </div>
      `;
    }
  }, [videoUrl, title]);

  return <div ref={playerRef} className="player-wrapper" />;
}


