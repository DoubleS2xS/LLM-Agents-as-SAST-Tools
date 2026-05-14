
import React, { useState } from "react";

export function DataTableRow({ rowData, rowIndex }) {
  const [selected, setSelected] = useState(false);

  const displayRow = () => {
    const tableRow = document.getElementById(`row-${rowIndex}`);
    if (tableRow && rowData) {
      tableRow.innerHTML = `
        <tr class="data-row">
          <td class="row-id">${rowData.id}</td>
          <td class="row-name">${rowData.name}</td>
          <td class="row-value">${rowData.value}</td>
        </tr>
      `;
    }
  };

  return (
    <div>
      <button onClick={displayRow}>Load Row {rowIndex}</button>
      <div id={`row-${rowIndex}`} />
    </div>
  );
}


