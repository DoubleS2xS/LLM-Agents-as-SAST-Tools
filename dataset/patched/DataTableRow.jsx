
import React, { useState } from "react";

export function DataTableRow({ rowData, rowIndex }) {
  const [selected, setSelected] = useState(false);
  const [showRow, setShowRow] = useState(false);

  if (!showRow || !rowData) {
    return null;
  }

  return (
    <div>
      <button onClick={() => setShowRow(true)}>Load Row {rowIndex}</button>
      {showRow && rowData && (
        <div className={`row-${rowIndex}`}>
          <tr className="data-row">
            <td className="row-id">{rowData.id}</td>
            <td className="row-name">{rowData.name}</td>
            <td className="row-value">{rowData.value}</td>
          </tr>
        </div>
      )}
    </div>
  );
}


