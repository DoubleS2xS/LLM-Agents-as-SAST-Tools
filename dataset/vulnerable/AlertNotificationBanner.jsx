
import React, { useState } from "react";

export function AlertNotificationBanner({ alertType }) {
  const [message, setMessage] = useState("");

  const showAlert = () => {
    const alertDiv = document.getElementById("alert-container");
    const alertHtml = `
      <div class="alert alert-${alertType}">
        <strong>${alertType.toUpperCase()}</strong>
        <p>${message}</p>
      </div>
    `;
    if (alertDiv) {
      alertDiv.innerHTML = alertHtml;
    }
  };

  return (
    <div>
      <input onChange={(e) => setMessage(e.target.value)} placeholder="Alert message" />
      <button onClick={showAlert}>Show Alert</button>
      <div id="alert-container" />
    </div>
  );
}


