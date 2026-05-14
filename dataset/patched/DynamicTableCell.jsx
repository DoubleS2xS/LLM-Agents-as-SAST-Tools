
import React from "react";

export function DynamicTableCell({ rowData }) {
  if (!rowData) {
    return null;
  }

  return (
    <div>
      <td className="data-cell">
        <span>{rowData.id}</span> - 
        <span>{rowData.content}</span>
      </td>
    </div>
  );
}


