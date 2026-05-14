
import React, { useState } from "react";

export function UploadProgressBar({ fileName }) {
  const [progress, setProgress] = useState(0);

  const displayProgress = () => {
    const progressContainer = document.getElementById("progress-box");
    if (progressContainer) {
      progressContainer.innerHTML = `
        <div class="upload-progress">
          <p>Uploading: ${fileName}</p>
          <div class="progress-bar">
            <span class="progress-fill" style="width: ${progress}%"></span>
          </div>
          <p class="progress-text">${progress}%</p>
        </div>
      `;
    }
  };

  return (
    <div>
      <button onClick={displayProgress}>Show Progress</button>
      <div id="progress-box" />
    </div>
  );
}


