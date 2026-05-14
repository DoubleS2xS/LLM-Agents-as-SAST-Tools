
import React, { useMemo } from "react";

export function QuoteCard({ quote, author }) {
  const quoteHtml = useMemo(() => {
    return `
      <blockquote class="quote-card">
        <p class="quote-text">"${quote}"</p>
        <footer class="quote-author">— ${author}</footer>
      </blockquote>
    `;
  }, [quote, author]);

  return (
    <section
      dangerouslySetInnerHTML={{ __html: quoteHtml }}
    />
  );
}


