
import React from "react";

export function DynamicMenuItem({ item }) {
  if (!item) {
    return null;
  }

  return (
    <div>
      <li className="menu-item">
        <a href={item.href} className="menu-link">
          {item.label}
        </a>
        <span className="menu-badge">{item.count}</span>
      </li>
    </div>
  );
}


