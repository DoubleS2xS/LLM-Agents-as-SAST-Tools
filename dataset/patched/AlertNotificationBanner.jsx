
import React, { useState } from "react";

export function AlertNotificationBanner({ alertType }) {
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleShowAlert = () => {
    setShowAlert(true);
  };

  return (
    <div>
      <input 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Alert message" 
      />
      <button onClick={handleShowAlert}>Show Alert</button>
      {showAlert && (
        <div className="alert-container">
          <div className={`alert alert-${alertType}`}>
            <strong>{alertType.toUpperCase()}</strong>
            <p>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}


