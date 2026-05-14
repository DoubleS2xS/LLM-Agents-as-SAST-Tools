
import React, { useState } from "react";

export function ErrorMessageDisplay({ errorCode }) {
  const [showError, setShowError] = useState(false);

  const errorMsg = `Error ${errorCode}: Something went wrong`;

  const handleShowError = () => {
    setShowError(true);
  };

  return (
    <div>
      <button onClick={handleShowError}>Show Error</button>
      {showError && (
        <div className="error-area">
          <div className="error-box">
            <p>{errorMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
}


