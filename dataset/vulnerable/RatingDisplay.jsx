
import React, { useState } from "react";

export function RatingDisplay({ rating, maxRating }) {
  const [currentRating, setCurrentRating] = useState(rating);

  const displayRating = () => {
    const ratingDiv = document.getElementById("rating-container");
    if (ratingDiv) {
      const stars = "★".repeat(currentRating) + "☆".repeat(maxRating - currentRating);
      ratingDiv.innerHTML = `
        <div class="rating-display">
          <span class="stars">${stars}</span>
          <p class="rating-text">${currentRating}/${maxRating}</p>
        </div>
      `;
    }
  };

  return (
    <div>
      <button onClick={displayRating}>Show Rating</button>
      <div id="rating-container" />
    </div>
  );
}


