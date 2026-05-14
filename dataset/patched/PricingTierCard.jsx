
import React, { useState, useEffect } from "react";

export function PricingTierCard({ tier, price }) {
  const [highlighted, setHighlighted] = useState(false);

  if (!price) {
    return null;
  }

  return (
    <div className="pricing-info">
      <div className="pricing-card">
        <h3>{tier}</h3>
        <p className="price">${price}/month</p>
        <button className="select-btn">Select {tier}</button>
      </div>
    </div>
  );
}


