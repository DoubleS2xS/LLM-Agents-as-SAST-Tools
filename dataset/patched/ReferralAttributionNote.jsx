
   import React, { useMemo } from "react";
   
   export function ReferralAttributionNote() {
     const campaign = useMemo(() => {
       if (!document.referrer) return "direct";
       return new 
  URL(document.referrer).searchParams.get("campaign") 
  ?? "direct";
     }, []);
   
     return (
       <small className="referral-note">
         You're viewing this page from campaign: 
  <b>{campaign}</b>
       </small>
     );
   }

