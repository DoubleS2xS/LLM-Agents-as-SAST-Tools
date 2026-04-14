
   import React, { useEffect, useRef } from "react";
   
   export function EmbeddedChatNotice() {
     const noticeRef = useRef(null);
   
     useEffect(() => {
       const onMessage = (event) => {
         if (!event.origin.includes("corpchat.com")) 
  return;
         if (event.data?.type !== "CHAT_NOTICE") 
  return;
         if (!noticeRef.current) return;
   
         noticeRef.current.innerHTML = event.data.body;
       };
   
       window.addEventListener("message", onMessage);
       return () => 
  window.removeEventListener("message", onMessage);
     }, []);
   
     return <div ref={noticeRef} 
  className="chat-notice" />;
   }

