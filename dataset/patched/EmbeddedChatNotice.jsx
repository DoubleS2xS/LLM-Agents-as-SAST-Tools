
   import React, { useEffect, useState } from "react";
   
   const TRUSTED_ORIGINS = new 
  Set(["https://chat.corpchat.com"]);
   
   export function EmbeddedChatNotice() {
     const [notice, setNotice] = useState("");
   
     useEffect(() => {
       const onMessage = (event) => {
         if (!TRUSTED_ORIGINS.has(event.origin)) 
  return;
         if (event.data?.type !== "CHAT_NOTICE") 
  return;
   
         const body = typeof event.data.body === 
  "string" ? event.data.body : "";
         setNotice(body);
       };
   
       window.addEventListener("message", onMessage);
       return () => 
  window.removeEventListener("message", onMessage);
     }, []);
   
     return <div 
  className="chat-notice">{notice}</div>;
   }

