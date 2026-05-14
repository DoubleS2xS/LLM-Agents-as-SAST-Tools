
import React, { useState } from "react";

export function RecommendationCard({ item }) {
  const [shown, setShown] = useState(false);

  const displayRecommendation = () => {
    const recDiv = document.getElementById("rec-display");
    if (recDiv && item) {
      recDiv.innerHTML = `
        <div class="recommendation">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <span class="rec-score">${item.score}</span>
        </div>
      `;
    }
  };

  return (
    <div>
      <button onClick={displayRecommendation}>Show Recommendation</button>
      <div id="rec-display" />
    </div>
  );
}


