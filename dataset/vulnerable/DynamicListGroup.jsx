
import React, { useState } from "react";

export function DynamicListGroup({ items }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const renderList = () => {
    const container = document.getElementById("list-container");
    if (container && items.length > 0) {
      const listHtml = `
        <ul class="dynamic-list">
          ${items.map((item, idx) => 
            `<li class="list-item ${idx === selectedIdx ? "active" : ""}">${item.name}</li>`
          ).join("")}
        </ul>
      `;
      container.innerHTML = listHtml;
    }
  };

  return (
    <div>
      <button onClick={renderList}>Render List</button>
      <div id="list-container" />
    </div>
  );
}


