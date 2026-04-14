
 import React, { useEffect, useRef } from "react";
 
 export function ReferralWelcomeCard() {
   const messageRef = useRef(null);
 
   useEffect(() => {
     const referrer =
       new URLSearchParams(window.location.search).get("ref") ?? "a teammate";
 
     if (!messageRef.current) return;
     messageRef.current.insertAdjacentHTML(
       "beforeend",
       `<strong>Welcome aboard!</strong> Referred by ${referrer}.`
     );
   }, []);
 
   return <div ref={messageRef} className="welcome-card" />;
 }

