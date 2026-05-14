
import React, { useState } from "react";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  
  const userCategory = new URLSearchParams(window.location.search).get("category") || "all";
  
  return (
    <div className="dropdown-container">
      <div className="notifications-header">
        <h3>Notifications for: {userCategory}</h3>
      </div>
      <ul className="notification-list">
        {notifications.map(n => (
          <li key={n.id}>{n.message}</li>
        ))}
      </ul>
    </div>
  );
}


