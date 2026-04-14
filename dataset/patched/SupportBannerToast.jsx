
 import React, { useEffect, useRef } from "react";
 import DOMPurify from "dompurify";
 
 const TRUSTED_SUPPORT_ORIGIN = "https://support.example.com";
 
 export function SupportBannerToast() {
   const toastRef = useRef(null);
 
   useEffect(() => {
     function onMessage(event) {
       if (event.origin !== TRUSTED_SUPPORT_ORIGIN) return;
       if (event.data?.type !== "SUPPORT_BANNER") return;
       if (!toastRef.current) return;
 
       const safeHtml = DOMPurify.sanitize(event.data.html ?? "", {
         ALLOWED_TAGS: ["b", "strong", "i", "em", "a", "br"],
         ALLOWED_ATTR: ["href", "target", "rel"],
       });
 
       toastRef.current.innerHTML = safeHtml;
       toastRef.current.classList.add("visible");
     }
 
     window.addEventListener("message", onMessage);
     return () => window.removeEventListener("message", onMessage);
   }, []);
 
   return <aside ref={toastRef} className="support-toast" aria-live="polite" />;
 }

