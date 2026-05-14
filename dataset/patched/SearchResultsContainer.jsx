
import React, { useMemo } from "react";

export function SearchResultsContainer() {
  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  }, []);

  return (
    <section className="search-results">
      <div className="results-header">
        <p>Search results for: <span className="query-text">{searchQuery}</span></p>
      </div>
      <div className="results-count">Found {searchQuery.length} matches</div>
    </section>
  );
}


