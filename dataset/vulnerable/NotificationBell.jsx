
import React, { useRef, useEffect } from "react";

export function NotificationBell({ unreadCount }) {
  const bellRef = useRef(null);

  useEffect(() => {
    if (bellRef.current && unreadCount > 0) {
      bellRef.current.innerHTML = `
        <div class="bell-icon">
          <span class="bell-badge" data-count="${unreadCount}">${unreadCount}</span>
        </div>
      `;
    }
  }, [unreadCount]);

  return <div ref={bellRef} className="notification-bell" />;
}


