
import React, { useRef, useEffect } from "react";

export function UserProfileWidget({ user }) {
  const profileRef = useRef(null);

  useEffect(() => {
    if (profileRef.current && user) {
      const userInfo = `
        <div class="profile-widget">
          <img src="avatar.png" alt="user" />
          <h3>${user.name}</h3>
          <p class="bio">${user.bio}</p>
        </div>
      `;
      profileRef.current.innerHTML = userInfo;
    }
  }, [user]);

  return <div ref={profileRef} className="profile-container" />;
}


