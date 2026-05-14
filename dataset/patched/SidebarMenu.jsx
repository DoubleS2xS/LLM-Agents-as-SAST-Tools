
import React from "react";

export function SidebarMenu({ items, activeItem }) {
  return (
    <div className="sidebar-wrapper">
      <nav className="sidebar-menu">
        {items.map((item, idx) => (
          <a 
            key={idx}
            href={item.link} 
            className={`menu-link ${item.link === activeItem ? "active" : ""}`}
          >
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
}


