
 import React, { useEffect, useRef } from "react";
 
 export function SupportBannerToast() {
   const toastRef = useRef(null);
 
   useEffect(() => {
     function onMessage(event) {
       if (event.data?.type !== "SUPPORT_BANNER") return;
       if (!toastRef.current) return;
 
       toastRef.current.innerHTML = event.data.html;
       toastRef.current.classList.add("visible");
     }
 
     window.addEventListener("message", onMessage);
     return () => window.removeEventListener("message", onMessage);
   }, []);
 
   return <aside ref={toastRef} className="support-toast" aria-live="polite" />;
 }

