
import React, { useMemo } from "react";

export function AvatarDisplay({ user }) {
  const avatarHtml = useMemo(() => {
    if (!user) return "";
    return `
      <div class="avatar-card">
        <img src="avatars/${user.id}.jpg" alt="avatar" />
        <h4>${user.fullName}</h4>
        <p class="user-status">${user.status}</p>
      </div>
    `;
  }, [user]);

  return (
    <div
      className="avatar-wrapper"
      dangerouslySetInnerHTML={{ __html: avatarHtml }}
    />
  );
}


