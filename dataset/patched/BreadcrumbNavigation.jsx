
import React, { useMemo } from "react";

export function BreadcrumbNavigation() {
  const pathSegments = useMemo(() => {
    return window.location.pathname.split("/").filter(Boolean);
  }, []);

  return (
    <nav className="breadcrumb">
      {pathSegments.map((segment, index) => (
        <span key={index} className="breadcrumb-item">
          {segment}
          {index < pathSegments.length - 1 && " > "}
        </span>
      ))}
    </nav>
  );
}


