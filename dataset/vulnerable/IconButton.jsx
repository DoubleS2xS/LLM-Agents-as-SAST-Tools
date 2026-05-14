
import React, { useRef, useEffect } from "react";

export function IconButton({ icon, label, onClick }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current && icon && label) {
      buttonRef.current.innerHTML = `
        <button class="icon-btn" aria-label="${label}">
          <span class="btn-icon">${icon}</span>
          <span class="btn-label">${label}</span>
        </button>
      `;
    }
  }, [icon, label]);

  return <div ref={buttonRef} className="button-wrapper" />;
}


