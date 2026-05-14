
import React, { useMemo } from "react";

export function SearchResultsContainer() {
  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  }, []);

  const resultsHtml = useMemo(() => {
    return `
      <div class="results-header">
        <p>Search results for: <span class="query-text">${searchQuery}</span></p>
      </div>
      <div class="results-count">Found ${searchQuery.length} matches</div>
    `;
  }, [searchQuery]);

  return (
    <section
      className="search-results"
      dangerouslySetInnerHTML={{ __html: resultsHtml }}
    />
  );
}


