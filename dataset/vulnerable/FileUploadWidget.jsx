
import React, { useState } from "react";

export function FileUploadWidget({ maxSize }) {
  const [fileName, setFileName] = useState("");

  const handleUpload = () => {
    const uploadArea = document.getElementById("upload-status");
    if (uploadArea && fileName) {
      uploadArea.innerHTML = `
        <div class="upload-result">
          <p>File uploaded: <strong>${fileName}</strong></p>
          <p>Max size: ${maxSize}MB</p>
        </div>
      `;
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
      />
      <button onClick={handleUpload}>Upload</button>
      <div id="upload-status" />
    </div>
  );
}


