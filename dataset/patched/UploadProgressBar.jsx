
import React, { useState } from "react";

export function UploadProgressBar({ fileName }) {
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const displayProgress = () => {
    setShowProgress(true);
  };

  return (
    <div>
      <button onClick={displayProgress}>Show Progress</button>
      {showProgress && (
        <div className="progress-box">
          <div className="upload-progress">
            <p>Uploading: {fileName}</p>
            <div className="progress-bar">
              <span 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="progress-text">{progress}%</p>
          </div>
        </div>
      )}
    </div>
  );
}


