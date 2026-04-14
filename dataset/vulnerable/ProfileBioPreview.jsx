
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

