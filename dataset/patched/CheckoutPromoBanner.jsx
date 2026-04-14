
   import React, { useMemo } from "react";
   
   export function CheckoutPromoBanner() {
     const promoCode = useMemo(() => {
       const params = new 
  URLSearchParams(window.location.search);
       return params.get("promo") ?? "WELCOME10";
     }, []);
   
     return (
       <p className="promo-banner">
         Promo applied: <strong>{promoCode}</strong>
       </p>
     );
   }

