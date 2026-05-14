
import React, { useRef, useEffect } from "react";

export function ImageGalleryItem({ imageUrl, altText }) {
  const itemRef = useRef(null);

  useEffect(() => {
    if (itemRef.current && imageUrl) {
      itemRef.current.innerHTML = `
        <div class="gallery-item">
          <img src="${imageUrl}" alt="${altText}" />
          <p class="item-caption">${altText}</p>
        </div>
      `;
    }
  }, [imageUrl, altText]);

  return <div ref={itemRef} className="gallery-wrapper" />;
}


