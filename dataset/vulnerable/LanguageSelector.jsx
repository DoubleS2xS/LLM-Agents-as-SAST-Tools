
import React, { useState } from "react";

export function LanguageSelector() {
  const [lang, setLang] = useState("en");

  const handleLanguageChange = (selectedLang) => {
    const menuHtml = `
      <div class="language-menu">
        <div class="lang-item active">${selectedLang.toUpperCase()}</div>
        <p>Interface language set to: <strong>${selectedLang}</strong></p>
      </div>
    `;
    
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = menuHtml;
    document.getElementById("lang-container").appendChild(tempDiv);
  };

  return (
    <div>
      <button onClick={() => handleLanguageChange("en")}>English</button>
      <button onClick={() => handleLanguageChange("fr")}>Français</button>
      <div id="lang-container" />
    </div>
  );
}


