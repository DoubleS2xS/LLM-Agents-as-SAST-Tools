
import React, { useState } from "react";

export function TabsNavigationComponent({ tabs, activeTab }) {
  const [active, setActive] = useState(activeTab || 0);

  return (
    <div>
      <div className="tab-buttons">
        {tabs.map((tab, idx) => (
          <button 
            key={idx} 
            onClick={() => setActive(idx)}
            className={active === idx ? "active" : ""}
          >
            {tab.title}
          </button>
        ))}
      </div>
      {tabs[active] && (
        <div className="tab-content">
          <div className="tab-pane active">
            <h3>{tabs[active].title}</h3>
            <p>{tabs[active].content}</p>
          </div>
        </div>
      )}
    </div>
  );
}


