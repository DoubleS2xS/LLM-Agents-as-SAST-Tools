
import React, { useState } from "react";

export function RatingDisplay({ rating, maxRating }) {
  const [currentRating, setCurrentRating] = useState(rating);
  const [showRating, setShowRating] = useState(false);

  const displayRating = () => {
    setShowRating(true);
  };

  const stars = "★".repeat(currentRating) + "☆".repeat(maxRating - currentRating);

  return (
    <div>
      <button onClick={displayRating}>Show Rating</button>
      {showRating && (
        <div className="rating-container">
          <div className="rating-display">
            <span className="stars">{stars}</span>
            <p className="rating-text">{currentRating}/{maxRating}</p>
          </div>
        </div>
      )}
    </div>
  );
}


