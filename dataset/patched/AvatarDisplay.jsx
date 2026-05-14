
import React from "react";

export function AvatarDisplay({ user }) {
  if (!user) {
    return null;
  }

  return (
    <div className="avatar-wrapper">
      <div className="avatar-card">
        <img src={`avatars/${user.id}.jpg`} alt="avatar" />
        <h4>{user.fullName}</h4>
        <p className="user-status">{user.status}</p>
      </div>
    </div>
  );
}


