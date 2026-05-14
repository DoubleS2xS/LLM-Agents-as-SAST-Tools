
import React from "react";

export function ImageGalleryItem({ imageUrl, altText }) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="gallery-wrapper">
      <div className="gallery-item">
        <img src={imageUrl} alt={altText} />
        <p className="item-caption">{altText}</p>
      </div>
    </div>
  );
}


