
import React, { useState } from "react";

export function ErrorMessageDisplay({ errorCode }) {
  const [message, setMessage] = useState("");

  const showError = () => {
    const errorMsg = `Error ${errorCode}: Something went wrong`;
    const errorDiv = document.getElementById("error-area");
    if (errorDiv) {
      errorDiv.innerHTML = `<div class="error-box"><p>${errorMsg}</p></div>`;
    }
  };

  return (
    <div>
      <button onClick={showError}>Show Error</button>
      <div id="error-area" />
    </div>
  );
}


