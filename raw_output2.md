 Component 1: CheckoutPromoBanner

  Vulnerability Type: Reflected DOM XSS via
  query-string data rendered with 
  dangerouslySetInnerHTML. Vulnerable Code:

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

  Patched Code:

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

  Component 2: EmbeddedChatNotice

  Vulnerability Type: DOM XSS from untrusted 
  postMessage payload combined with weak origin
  validation and innerHTML. Vulnerable Code:

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

  Patched Code:

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

  Component 3: SavedFilterChip

  Vulnerability Type: Persistent client-side DOM XSS by
  injecting untrusted localStorage content into HTML. 
  Vulnerable Code:

   import React, { useMemo } from "react";
   
   export function SavedFilterChip() {
     const savedLabel = useMemo(
       () => 
  localStorage.getItem("inventory.savedFilterLabel") ??
   "All products",
       []
     );
   
     const chipHtml = useMemo(
       () => `<span 
  class="chip-label">${savedLabel}</span>`,
       [savedLabel]
     );
   
     return (
       <button
         type="button"
         className="filter-chip"
         dangerouslySetInnerHTML={{ __html: chipHtml }}
       />
     );
   }

  Patched Code:

   import React, { useMemo } from "react";
   
   export function SavedFilterChip() {
     const savedLabel = useMemo(
       () => 
  localStorage.getItem("inventory.savedFilterLabel") ??
   "All products",
       []
     );
   
     return (
       <button type="button" className="filter-chip">
         <span 
  className="chip-label">{savedLabel}</span>
       </button>
     );
   }

  Component 4: ReferralAttributionNote

  Vulnerability Type: DOM XSS through document.referrer
  query param inserted with insertAdjacentHTML. 
  Vulnerable Code:

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

  Patched Code:

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

  Component 5: DocsSnippetPreviewFrame

  Vulnerability Type: DOM XSS via untrusted URL input
  injected into iframe srcDoc with script execution
  allowed. Vulnerable Code:

   import React, { useMemo } from "react";
   
   export function DocsSnippetPreviewFrame() {
     const snippet = useMemo(() => {
       const params = new 
  URLSearchParams(window.location.search);
       return params.get("snippet") ?? "<p>No snippet 
  provided.</p>";
     }, []);
   
     const srcDoc = useMemo(
       () => `<!doctype html>
   <html>
     <body>
       <h4>Snippet Preview</h4>
       ${snippet}
     </body>
   </html>`,
       [snippet]
     );
   
     return (
       <iframe
         title="Docs Snippet Preview"
         className="docs-preview"
         sandbox="allow-scripts allow-same-origin"
         srcDoc={srcDoc}
       />
     );
   }

  Patched Code:

   import React, { useMemo } from "react";
   
   function escapeHtml(value) {
     return value
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#39;");
   }
   
   export function DocsSnippetPreviewFrame() {
     const snippet = useMemo(() => {
       const params = new 
  URLSearchParams(window.location.search);
       return params.get("snippet") ?? "No snippet 
  provided.";
     }, []);
   
     const safeSnippet = useMemo(() => 
  escapeHtml(snippet), [snippet]);
   
     const srcDoc = useMemo(
       () => `<!doctype html>
   <html>
     <body>
       <h4>Snippet Preview</h4>
       <pre>${safeSnippet}</pre>
     </body>
   </html>`,
       [safeSnippet]
     );
   
     return (
       <iframe
         title="Docs Snippet Preview"
         className="docs-preview"
         sandbox=""
         srcDoc={srcDoc}
       />
     );
   }