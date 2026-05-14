
import React, { useMemo } from "react";

export function FooterWidget({ companyName, year }) {
  const footerHtml = useMemo(() => {
    return `
      <footer class="app-footer">
        <p>&copy; ${year} ${companyName}</p>
        <nav class="footer-links">
          <a href="/privacy">Privacy</a> | <a href="/terms">Terms</a>
        </nav>
      </footer>
    `;
  }, [companyName, year]);

  return (
    <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
  );
}


