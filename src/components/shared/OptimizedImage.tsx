import { useState, useEffect, useRef } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
}

const loaded = new Set<string>();

export function OptimizedImage({ src, alt, className = "" }: OptimizedImageProps) {
  const [state, setState] = useState<"loading" | "loaded" | "error">(
    loaded.has(src) ? "loaded" : "loading"
  );
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (loaded.has(src)) {
      setState("loaded");
      return;
    }

    const img = new Image();
    img.src = src;

    img.onload = () => {
      loaded.add(src);
      setState("loaded");
    };
    img.onerror = () => setState("error");

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (state === "error") {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <span className="text-xs text-muted">No image</span>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      {state === "loading" && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          state === "loaded" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

/** Preload a batch of image URLs into the browser cache. */
export function preloadImages(urls: string[]) {
  urls.forEach((url) => {
    if (loaded.has(url)) return;
    const img = new Image();
    img.src = url;
    img.onload = () => loaded.add(url);
  });
}
