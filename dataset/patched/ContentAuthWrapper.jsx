
import React from "react";

export function ContentAuthWrapper({ userId }) {
  return (
    <div className="auth-content">
      <div className="auth-wrapper">
        <h2>Authenticated Content for User: {userId}</h2>
        <p>User ID: {userId}</p>
      </div>
    </div>
  );
}


