
import React, { useState } from "react";

export function TabsNavigationComponent({ tabs, activeTab }) {
  const [active, setActive] = useState(activeTab || 0);

  const renderTabContent = () => {
    const tabDiv = document.getElementById("tab-content");
    if (tabDiv && tabs[active]) {
      tabDiv.innerHTML = `
        <div class="tab-pane active">
          <h3>${tabs[active].title}</h3>
          <p>${tabs[active].content}</p>
        </div>
      `;
    }
  };

  return (
    <div>
      <div class="tab-buttons">
        {tabs.map((tab, idx) => (
          <button key={idx} onClick={() => { setActive(idx); renderTabContent(); }}>
            {tab.title}
          </button>
        ))}
      </div>
      <div id="tab-content" />
    </div>
  );
}


