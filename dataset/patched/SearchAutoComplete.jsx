
import React, { useState, useMemo } from "react";

export function SearchAutoComplete({ suggestions }) {
  const [query, setQuery] = useState("");

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(s => 
      s.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, suggestions]);

  return (
    <div>
      <input 
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {query && filteredSuggestions.length > 0 && (
        <div className="suggestions-list">
          <ul className="suggestions">
            {filteredSuggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


