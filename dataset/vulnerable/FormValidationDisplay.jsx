
import React, { useState } from "react";

export function FormValidationDisplay({ fieldName, value }) {
  const [validationMsg, setValidationMsg] = useState("");

  const showValidation = () => {
    const msgContainer = document.getElementById("validation-messages");
    const msg = `
      <div class="validation-message">
        <strong>${fieldName}</strong>: ${value}
        <p>Value accepted</p>
      </div>
    `;
    if (msgContainer) {
      msgContainer.innerHTML = msg;
    }
  };

  return (
    <div>
      <button onClick={showValidation}>Validate</button>
      <div id="validation-messages" />
    </div>
  );
}


