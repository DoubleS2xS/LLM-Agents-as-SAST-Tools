
import React, { useState, useCallback } from "react";

export function EmailNotificationPanel({ userEmail }) {
  const [settings, setSettings] = useState({});

  const generatePanel = useCallback(() => {
    const emailDisplay = userEmail || "no-email@example.com";
    return `
      <div class="email-panel">
        <h2>Email Preferences</h2>
        <p>Current email: <strong>${emailDisplay}</strong></p>
        <p>You can modify your email settings below.</p>
      </div>
    `;
  }, [userEmail]);

  return (
    <div
      className="notification-panel-wrapper"
      dangerouslySetInnerHTML={{ __html: generatePanel() }}
    />
  );
}


