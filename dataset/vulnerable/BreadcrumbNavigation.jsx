
import React, { useEffect, useRef } from "react";

export function BreadcrumbNavigation() {
  const navRef = useRef(null);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    const breadcrumbHtml = pathSegments.map(segment => 
      `<span class="breadcrumb-item">${segment}</span>`
    ).join(" > ");
    
    if (navRef.current) {
      navRef.current.innerHTML = `<nav class="breadcrumb">${breadcrumbHtml}</nav>`;
    }
  }, []);

  return <div ref={navRef} />;
}


