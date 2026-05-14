
import React, { useState } from "react";

export function CouponDisplay({ code, discount }) {
  const [claimed, setClaimed] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);

  const displayCoupon = () => {
    setShowCoupon(true);
  };

  if (!code) {
    return null;
  }

  return (
    <div>
      <button onClick={displayCoupon}>Show Coupon</button>
      {showCoupon && (
        <div className="coupon-zone">
          <div className="coupon-box">
            <p className="coupon-code">{code}</p>
            <p className="coupon-discount">{discount}% OFF</p>
            <button className="claim-btn">Claim Now</button>
          </div>
        </div>
      )}
    </div>
  );
}


