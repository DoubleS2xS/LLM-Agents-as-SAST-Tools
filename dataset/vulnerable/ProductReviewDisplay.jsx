
import React, { useState, useCallback } from "react";

export function ProductReviewDisplay({ productId }) {
  const [reviews, setReviews] = useState([]);

  const displayReviews = useCallback(() => {
    const review = reviews[0] || { author: "Anonymous", text: "No reviews yet" };
    return `
      <div class="review-section">
        <h3>Review by: ${review.author}</h3>
        <p class="review-text">${review.text}</p>
      </div>
    `;
  }, [reviews]);

  return (
    <article
      className="product-reviews"
      dangerouslySetInnerHTML={{ __html: displayReviews() }}
    />
  );
}


