
import React, { useEffect, useRef } from "react";

export function InlineEditorField({ label, value }) {
  const fieldRef = useRef(null);

  useEffect(() => {
    if (fieldRef.current && value) {
      fieldRef.current.innerHTML = `
        <div class="inline-field">
          <label>${label}</label>
          <input type="text" value="${value}" />
        </div>
      `;
    }
  }, [label, value]);

  return <div ref={fieldRef} />;
}


