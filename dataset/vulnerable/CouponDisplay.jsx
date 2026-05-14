
import React, { useState } from "react";

export function CouponDisplay({ code, discount }) {
  const [claimed, setClaimed] = useState(false);

  const displayCoupon = () => {
    const couponArea = document.getElementById("coupon-zone");
    if (couponArea && code) {
      couponArea.innerHTML = `
        <div class="coupon-box">
          <p class="coupon-code">${code}</p>
          <p class="coupon-discount">${discount}% OFF</p>
          <button class="claim-btn">Claim Now</button>
        </div>
      `;
    }
  };

  return (
    <div>
      <button onClick={displayCoupon}>Show Coupon</button>
      <div id="coupon-zone" />
    </div>
  );
}


