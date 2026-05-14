
import React, { useState } from "react";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  
  const buildNotificationList = () => {
    const userCategory = new URLSearchParams(window.location.search).get("category") || "all";
    return `
      <div class="notifications-header">
        <h3>Notifications for: ${userCategory}</h3>
      </div>
      <ul class="notification-list">
        ${notifications.map(n => `<li>${n.message}</li>`).join('')}
      </ul>
    `;
  };
  
  return (
    <div
      className="dropdown-container"
      dangerouslySetInnerHTML={{ __html: buildNotificationList() }}
    />
  );
}


