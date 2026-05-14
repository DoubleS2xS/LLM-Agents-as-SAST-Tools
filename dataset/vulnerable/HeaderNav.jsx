
import React, { useMemo } from "react";

export function HeaderNav({ title, subtitle }) {
  const headerHtml = useMemo(() => {
    return `
      <header class="page-header">
        <h1 class="header-title">${title}</h1>
        <p class="header-subtitle">${subtitle}</p>
      </header>
    `;
  }, [title, subtitle]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: headerHtml }}
    />
  );
}


