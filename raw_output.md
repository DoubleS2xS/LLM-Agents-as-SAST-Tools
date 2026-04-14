Component 1: ProductSearchHeader

Vulnerability Type: Reflected DOM XSS via window.location.search injected into 
dangerouslySetInnerHTML. Vulnerable Code:

 import React, { useMemo } from "react";
 
 export function ProductSearchHeader() {
   const query = useMemo(() => {
     const params = new URLSearchParams(window.location.search);
     return params.get("q") ?? "";
   }, []);
 
   const summaryHtml = useMemo(() => {
     if (!query) return "Showing all products";
     return `Showing results for <mark>${query}</mark>`;
   }, [query]);
 
   return (
     <h2
       className="text-xl font-semibold"
       dangerouslySetInnerHTML={{ __html: summaryHtml }}
     />
   );
 }

Patched Code:

 import React, { useMemo } from "react";
 
 export function ProductSearchHeader() {
   const query = useMemo(() => {
     const params = new URLSearchParams(window.location.search);
     return params.get("q") ?? "";
   }, []);
 
   return (
     <h2 className="text-xl font-semibold">
       {query ? (
         <>
           Showing results for <mark>{query}</mark>
         </>
       ) : (
         "Showing all products"
       )}
     </h2>
   );
 }

Component 2: SupportBannerToast

Vulnerability Type: DOM XSS via untrusted postMessage payload written to innerHTML without origin
validation. Vulnerable Code:

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

Patched Code:

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

Component 3: ProfileBioPreview

Vulnerability Type: Persistent client-side DOM XSS from localStorage content rendered as HTML. 
Vulnerable Code:

 import React, { useMemo } from "react";
 
 export function ProfileBioPreview() {
   const draftBio = useMemo(
     () => localStorage.getItem("profile.bioDraft") ?? "",
     []
   );
 
   const previewHtml = useMemo(() => {
     return draftBio.replace(/\n/g, "<br />");
   }, [draftBio]);
 
   return (
     <section className="card">
       <h3>Bio Preview</h3>
       <p dangerouslySetInnerHTML={{ __html: previewHtml }} />
     </section>
   );
 }

Patched Code:

 import React, { useMemo } from "react";
 
 export function ProfileBioPreview() {
   const draftBio = useMemo(
     () => localStorage.getItem("profile.bioDraft") ?? "",
     []
   );
 
   return (
     <section className="card">
       <h3>Bio Preview</h3>
       <p style={{ whiteSpace: "pre-wrap" }}>{draftBio}</p>
     </section>
   );
 }

Component 4: DocsPreviewFrame

Vulnerability Type: DOM XSS via hash fragment injected into iframe srcDoc with script execution
enabled. Vulnerable Code:

 import React, { useMemo } from "react";
 
 export function DocsPreviewFrame() {
   const topic = useMemo(() => {
     const raw = window.location.hash.replace(/^#topic=/, "");
     return decodeURIComponent(raw || "");
   }, []);
 
   const srcDoc = `
     <!doctype html>
     <html>
       <body>
         <h1>${topic || "Help Center"}</h1>
         <p>Read the latest documentation updates.</p>
       </body>
     </html>
   `;
 
   return (
     <iframe
       title="Documentation Preview"
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
 
 export function DocsPreviewFrame() {
   const topic = useMemo(() => {
     const raw = window.location.hash.replace(/^#topic=/, "");
     return decodeURIComponent(raw || "");
   }, []);
 
   const safeTopic = useMemo(() => escapeHtml(topic), [topic]);
 
   const srcDoc = `
     <!doctype html>
     <html>
       <body>
         <h1>${safeTopic || "Help Center"}</h1>
         <p>Read the latest documentation updates.</p>
       </body>
     </html>
   `;
 
   return (
     <iframe
       title="Documentation Preview"
       className="docs-preview"
       sandbox="allow-same-origin"
       srcDoc={srcDoc}
     />
   );
 }

Component 5: ReferralWelcomeCard

Vulnerability Type: DOM XSS via URL parameter injected with insertAdjacentHTML. Vulnerable Code:

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

Patched Code:

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