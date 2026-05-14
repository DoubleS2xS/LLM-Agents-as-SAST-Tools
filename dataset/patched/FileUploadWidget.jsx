
import React, { useState } from "react";

export function FileUploadWidget({ maxSize }) {
  const [fileName, setFileName] = useState("");
  const [showStatus, setShowStatus] = useState(false);

  const handleUpload = () => {
    if (fileName) {
      setShowStatus(true);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
      />
      <button onClick={handleUpload}>Upload</button>
      {showStatus && fileName && (
        <div className="upload-status">
          <div className="upload-result">
            <p>File uploaded: <strong>{fileName}</strong></p>
            <p>Max size: {maxSize}MB</p>
          </div>
        </div>
      )}
    </div>
  );
}


