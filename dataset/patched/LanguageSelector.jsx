
import React, { useState } from "react";

export function LanguageSelector() {
  const [lang, setLang] = useState("en");

  const handleLanguageChange = (selectedLang) => {
    setLang(selectedLang);
  };

  return (
    <div>
      <button onClick={() => handleLanguageChange("en")}>English</button>
      <button onClick={() => handleLanguageChange("fr")}>Français</button>
      <div className="lang-container">
        <div className="language-menu">
          <div className="lang-item active">{lang.toUpperCase()}</div>
          <p>Interface language set to: <strong>{lang}</strong></p>
        </div>
      </div>
    </div>
  );
}


