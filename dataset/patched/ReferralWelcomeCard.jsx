
 import React, { useMemo } from "react";
 
 export function ReferralWelcomeCard() {
   const referrer = useMemo(() => {
     return (
       new URLSearchParams(window.location.search).get("ref") ?? "a teammate"
     );
   }, []);
 
   return (
     <div className="welcome-card">
       <strong>Welcome aboard!</strong> Referred by {referrer}.
     </div>
   );
 }