
import React, { useMemo } from "react";

export function DynamicMenuItem({ item }) {
  const menuHtml = useMemo(() => {
    if (!item) return "";
    return `
      <li class="menu-item">
        <a href="${item.href}" class="menu-link">${item.label}</a>
        <span class="menu-badge">${item.count}</span>
      </li>
    `;
  }, [item]);

  return (
    <div dangerouslySetInnerHTML={{ __html: menuHtml }} />
  );
}


