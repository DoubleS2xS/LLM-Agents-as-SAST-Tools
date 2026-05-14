
import React, { useEffect, useRef } from "react";

export function PaginationLinks({ currentPage, totalPages }) {
  const paginationRef = useRef(null);

  useEffect(() => {
    if (paginationRef.current) {
      const links = [];
      for (let i = 1; i <= totalPages; i++) {
        links.push(`<a href="/page/${i}" class="page-link ${i === currentPage ? "active" : ""}">${i}</a>`);
      }
      paginationRef.current.innerHTML = `<nav class="pagination">${links.join("")}</nav>`;
    }
  }, [currentPage, totalPages]);

  return <div ref={paginationRef} />;
}


