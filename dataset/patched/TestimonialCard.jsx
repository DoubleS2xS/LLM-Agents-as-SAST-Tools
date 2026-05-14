
import React from "react";

export function TestimonialCard({ quote, author, role }) {
  return (
    <article>
      <div className="testimonial-card">
        <blockquote className="testimonial-quote">"{quote}"</blockquote>
        <div className="testimonial-author">
          <strong>{author}</strong>
          <span className="author-role">{role}</span>
        </div>
      </div>
    </article>
  );
}


