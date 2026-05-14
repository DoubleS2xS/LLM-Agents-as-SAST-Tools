
import React from "react";

export function NotificationBell({ unreadCount }) {
  if (unreadCount <= 0) {
    return null;
  }

  return (
    <div className="notification-bell">
      <div className="bell-icon">
        <span className="bell-badge" data-count={unreadCount}>
          {unreadCount}
        </span>
      </div>
    </div>
  );
}


