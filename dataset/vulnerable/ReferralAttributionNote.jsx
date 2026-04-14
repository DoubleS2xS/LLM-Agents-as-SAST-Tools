
   import React, { useEffect, useRef } from "react";
   
   export function ReferralAttributionNote() {
     const noteRef = useRef(null);
   
     useEffect(() => {
       if (!document.referrer || !noteRef.current) 
  return;
   
       const campaign =
         new 
  URL(document.referrer).searchParams.get("campaign") 
  ?? "direct";
   
       noteRef.current.insertAdjacentHTML(
         "beforeend",
         `You're viewing this page from campaign: 
  <b>${campaign}</b>`
       );
     }, []);
   
     return <small ref={noteRef} 
  className="referral-note" />;
   }

