
import React, { useMemo } from "react";

export function BadgeLabel({ text, variant }) {
  const badgeHtml = useMemo(() => {
    const variants = {
      primary: "badge-primary",
      success: "badge-success",
      danger: "badge-danger"
    };
    const className = variants[variant] || "badge-default";
    return `<span class="badge ${className}">${text}</span>`;
  }, [text, variant]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: badgeHtml }}
    />
  );
}


