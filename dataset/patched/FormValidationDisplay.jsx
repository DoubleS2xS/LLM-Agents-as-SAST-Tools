
import React, { useState } from "react";

export function FormValidationDisplay({ fieldName, value }) {
  const [validationMsg, setValidationMsg] = useState("");

  const showValidation = () => {
    setValidationMsg(`${fieldName}: ${value}`);
  };

  return (
    <div>
      <button onClick={showValidation}>Validate</button>
      {validationMsg && (
        <div className="validation-messages">
          <div className="validation-message">
            <strong>{fieldName}</strong>: {value}
            <p>Value accepted</p>
          </div>
        </div>
      )}
    </div>
  );
}


