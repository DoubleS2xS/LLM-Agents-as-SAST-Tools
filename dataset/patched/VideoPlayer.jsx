
import React from "react";

export function VideoPlayer({ videoUrl, title }) {
  if (!videoUrl) {
    return null;
  }

  return (
    <div className="player-wrapper">
      <div className="video-player">
        <video src={videoUrl} title={title} controls />
      </div>
    </div>
  );
}


