
   import React, { useMemo } from "react";
   
   export function CheckoutPromoBanner() {
     const promoCode = useMemo(() => {
       const params = new 
  URLSearchParams(window.location.search);
       return params.get("promo") ?? "WELCOME10";
     }, []);
   
     const bannerHtml = useMemo(
       () => `Promo applied: 
  <strong>${promoCode}</strong>`,
       [promoCode]
     );
   
     return (
       <p
         className="promo-banner"
         dangerouslySetInnerHTML={{ __html: bannerHtml 
  }}
       />
     );
   }

