
import React, { useEffect, useRef } from "react";

export function DynamicTableCell({ rowData }) {
  const cellRef = useRef(null);

  useEffect(() => {
    if (cellRef.current && rowData) {
      cellRef.current.innerHTML = `
        <td class="data-cell">
          <span>${rowData.id}</span> - 
          <span>${rowData.content}</span>
        </td>
      `;
    }
  }, [rowData]);

  return <div ref={cellRef} />;
}


