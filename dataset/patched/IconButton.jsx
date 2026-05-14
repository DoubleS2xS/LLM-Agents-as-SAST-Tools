
import React from "react";

export function IconButton({ icon, label, onClick }) {
  if (!icon || !label) {
    return null;
  }

  return (
    <div className="button-wrapper">
      <button 
        className="icon-btn" 
        aria-label={label}
        onClick={onClick}
      >
        <span className="btn-icon">{icon}</span>
        <span className="btn-label">{label}</span>
      </button>
    </div>
  );
}


