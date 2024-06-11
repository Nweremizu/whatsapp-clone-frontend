// A componenet for lazy loading images
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function Image({ src, alt, className }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <LazyLoadImage
      alt={alt}
      src={src}
      effect="opacity"
      onLoad={() => setIsLoaded(true)}
      className={`${className} ${isLoaded ? "" : "opacity-0"}`}
    />
  );
}
