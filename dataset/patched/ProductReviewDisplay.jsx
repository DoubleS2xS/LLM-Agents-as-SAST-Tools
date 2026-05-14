
import React, { useState } from "react";

export function ProductReviewDisplay({ productId }) {
  const [reviews, setReviews] = useState([]);
  const review = reviews[0] || { author: "Anonymous", text: "No reviews yet" };

  return (
    <article className="product-reviews">
      <div className="review-section">
        <h3>Review by: {review.author}</h3>
        <p className="review-text">{review.text}</p>
      </div>
    </article>
  );
}


