"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Orientation-aware screenshot image.
 * Portrait captures (e.g. phone screenshots) are shown fully via object-contain
 * on a warm backdrop that matches the capture's edges, instead of being
 * center-cropped by object-cover. Landscape covers behave exactly as before.
 *
 * Orientation is detected both on mount (cached images never re-fire onLoad
 * by the time React hydrates) and on the load event itself.
 */
export function CoverImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  loading?: "lazy" | "eager";
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [portrait, setPortrait] = useState(false);

  const check = () => {
    const img = ref.current;
    if (img && img.naturalWidth > 0) {
      setPortrait(img.naturalHeight > img.naturalWidth);
    }
  };

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolved = portrait
    ? `${className.replace(/\bobject-cover\b/g, "object-contain")} bg-[#faf1e8]`
    : className;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={loading}
      onLoad={check}
      className={resolved}
      {...rest}
    />
  );
}
