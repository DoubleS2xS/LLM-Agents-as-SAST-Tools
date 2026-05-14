
import React, { useState, useCallback } from "react";

export function ModalConfirmDialog({ title, description }) {
  const [isOpen, setIsOpen] = useState(false);

  const renderModal = useCallback(() => {
    if (!isOpen) return null;
    return `
      <div class="modal-overlay">
        <div class="modal-content">
          <h2 class="modal-title">${title}</h2>
          <p class="modal-description">${description}</p>
          <div class="modal-actions">
            <button class="confirm">Confirm</button>
          </div>
        </div>
      </div>
    `;
  }, [isOpen, title, description]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: renderModal() || "<div></div>" }}
    />
  );
}


