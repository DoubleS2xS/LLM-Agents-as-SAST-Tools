
import React, { useEffect, useRef } from "react";

export function ThemeCustomizer() {
  const containerRef = useRef(null);

  useEffect(() => {
    const themeData = sessionStorage.getItem("theme") || "{}";
    if (containerRef.current) {
      containerRef.current.innerHTML = `
        <div class="theme-preview">
          <h3>Your Theme: ${themeData}</h3>
          <p>Customize your appearance</p>
        </div>
      `;
    }
  }, []);

  return <div ref={containerRef} className="theme-customizer" />;
}


