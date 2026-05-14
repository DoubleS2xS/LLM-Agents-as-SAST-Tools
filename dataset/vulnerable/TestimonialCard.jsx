
import React, { useMemo } from "react";

export function TestimonialCard({ quote, author, role }) {
  const testimonialHtml = useMemo(() => {
    return `
      <div class="testimonial-card">
        <blockquote class="testimonial-quote">"${quote}"</blockquote>
        <div class="testimonial-author">
          <strong>${author}</strong>
          <span class="author-role">${role}</span>
        </div>
      </div>
    `;
  }, [quote, author, role]);

  return (
    <article
      dangerouslySetInnerHTML={{ __html: testimonialHtml }}
    />
  );
}


