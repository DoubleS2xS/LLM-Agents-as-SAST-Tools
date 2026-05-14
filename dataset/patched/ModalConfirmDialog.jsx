
import React, { useState } from "react";

export function ModalConfirmDialog({ title, description }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return null;
  }

  return (
    <div>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">{title}</h2>
          <p className="modal-description">{description}</p>
          <div className="modal-actions">
            <button className="confirm">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}


