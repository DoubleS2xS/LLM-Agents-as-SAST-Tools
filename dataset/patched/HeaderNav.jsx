
import React from "react";

export function HeaderNav({ title, subtitle }) {
  return (
    <header className="page-header">
      <h1 className="header-title">{title}</h1>
      <p className="header-subtitle">{subtitle}</p>
    </header>
  );
}


