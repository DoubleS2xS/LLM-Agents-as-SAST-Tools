
import React from "react";

export function UserProfileWidget({ user }) {
  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-widget">
        <img src="avatar.png" alt="user" />
        <h3>{user.name}</h3>
        <p className="bio">{user.bio}</p>
      </div>
    </div>
  );
}


