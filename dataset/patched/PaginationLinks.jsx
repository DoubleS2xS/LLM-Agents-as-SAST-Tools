
import React from "react";

export function PaginationLinks({ currentPage, totalPages }) {
  const links = [];
  for (let i = 1; i <= totalPages; i++) {
    links.push(i);
  }

  return (
    <nav className="pagination">
      {links.map(i => (
        <a 
          key={i}
          href={`/page/${i}`} 
          className={`page-link ${i === currentPage ? "active" : ""}`}
        >
          {i}
        </a>
      ))}
    </nav>
  );
}


