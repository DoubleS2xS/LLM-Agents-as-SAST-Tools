
import React, { useState, useEffect } from "react";

export function PricingTierCard({ tier, price }) {
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    const priceDiv = document.getElementById("pricing-info");
    if (priceDiv && price) {
      priceDiv.innerHTML = `
        <div class="pricing-card">
          <h3>${tier}</h3>
          <p class="price">$${price}/month</p>
          <button class="select-btn">Select ${tier}</button>
        </div>
      `;
    }
  }, [tier, price]);

  return <div id="pricing-info" />;
}


