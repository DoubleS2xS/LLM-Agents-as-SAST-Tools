
import React, { useState, useEffect } from "react";

export function ThemeCustomizer() {
  const [themeData, setThemeData] = useState("{}");

  useEffect(() => {
    const stored = sessionStorage.getItem("theme") || "{}";
    setThemeData(stored);
  }, []);

  return (
    <div className="theme-customizer">
      <div className="theme-preview">
        <h3>Your Theme: {themeData}</h3>
        <p>Customize your appearance</p>
      </div>
    </div>
  );
}


