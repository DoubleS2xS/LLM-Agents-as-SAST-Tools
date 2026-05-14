
import React, { useState } from "react";

export function DynamicListGroup({ items }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showList, setShowList] = useState(false);

  const renderList = () => {
    setShowList(true);
  };

  return (
    <div>
      <button onClick={renderList}>Render List</button>
      {showList && items.length > 0 && (
        <div className="list-container">
          <ul className="dynamic-list">
            {items.map((item, idx) => (
              <li 
                key={idx}
                className={`list-item ${idx === selectedIdx ? "active" : ""}`}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


