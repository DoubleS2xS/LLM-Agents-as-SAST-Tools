
import React from "react";

export function FooterWidget({ companyName, year }) {
  return (
    <footer className="app-footer">
      <p>&copy; {year} {companyName}</p>
      <nav className="footer-links">
        <a href="/privacy">Privacy</a> | <a href="/terms">Terms</a>
      </nav>
    </footer>
  );
}


