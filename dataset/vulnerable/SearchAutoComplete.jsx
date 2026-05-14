
import React, { useState } from "react";

export function SearchAutoComplete({ suggestions }) {
  const [query, setQuery] = useState("");

  const displaySuggestions = () => {
    const suggestDiv = document.getElementById("suggestions-list");
    if (suggestDiv) {
      const filteredSuggestions = suggestions.filter(s => 
        s.toLowerCase().includes(query.toLowerCase())
      );
      suggestDiv.innerHTML = `
        <ul class="suggestions">
          ${filteredSuggestions.map(s => `<li>${s}</li>`).join("")}
        </ul>
      `;
    }
  };

  return (
    <div>
      <input 
        type="search"
        value={query}
        onChange={(e) => { setQuery(e.target.value); displaySuggestions(); }}
        placeholder="Search..."
      />
      <div id="suggestions-list" />
    </div>
  );
}


