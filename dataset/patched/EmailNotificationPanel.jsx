
import React, { useState } from "react";

export function EmailNotificationPanel({ userEmail }) {
  const [settings, setSettings] = useState({});
  const emailDisplay = userEmail || "no-email@example.com";

  return (
    <div className="notification-panel-wrapper">
      <div className="email-panel">
        <h2>Email Preferences</h2>
        <p>Current email: <strong>{emailDisplay}</strong></p>
        <p>You can modify your email settings below.</p>
      </div>
    </div>
  );
}


