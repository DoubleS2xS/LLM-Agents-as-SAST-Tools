
import React, { useMemo } from "react";

export function SidebarMenu({ items, activeItem }) {
  const menuHtml = useMemo(() => {
    return `
      <nav class="sidebar-menu">
        ${items.map(item => 
          `<a href="${item.link}" class="menu-link ${item.link === activeItem ? "active" : ""}">${item.name}</a>`
        ).join("")}
      </nav>
    `;
  }, [items, activeItem]);

  return (
    <div
      className="sidebar-wrapper"
      dangerouslySetInnerHTML={{ __html: menuHtml }}
    />
  );
}


