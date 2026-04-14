
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

