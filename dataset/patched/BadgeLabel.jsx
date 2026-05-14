
import React from "react";

export function BadgeLabel({ text, variant }) {
  const variants = {
    primary: "badge-primary",
    success: "badge-success",
    danger: "badge-danger"
  };
  const className = variants[variant] || "badge-default";

  return (
    <div>
      <span className={`badge ${className}`}>{text}</span>
    </div>
  );
}


