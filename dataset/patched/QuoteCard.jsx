
import React from "react";

export function QuoteCard({ quote, author }) {
  return (
    <section>
      <blockquote className="quote-card">
        <p className="quote-text">"{quote}"</p>
        <footer className="quote-author">— {author}</footer>
      </blockquote>
    </section>
  );
}


