
import React, { useState } from "react";

export function InlineEditorField({ label, value }) {
  const [fieldValue, setFieldValue] = useState(value);

  return (
    <div>
      <div className="inline-field">
        <label>{label}</label>
        <input 
          type="text" 
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
        />
      </div>
    </div>
  );
}


