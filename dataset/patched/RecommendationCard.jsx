
import React, { useState } from "react";

export function RecommendationCard({ item }) {
  const [shown, setShown] = useState(false);

  if (!shown || !item) {
    return null;
  }

  const displayRecommendation = () => {
    setShown(true);
  };

  return (
    <div>
      <button onClick={displayRecommendation}>Show Recommendation</button>
      {shown && item && (
        <div className="rec-display">
          <div className="recommendation">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <span className="rec-score">{item.score}</span>
          </div>
        </div>
      )}
    </div>
  );
}


