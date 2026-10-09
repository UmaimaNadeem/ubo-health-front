import { useEffect, useState, type ReactNode } from "react";

const LENS_SCALE = 2.2;

/** True only on devices with a real hovering pointer (mouse/trackpad). */
function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

type Props = {
  src?: string;
  alt: string;
  /** Overlay content (badges) rendered above the image. */
  children?: ReactNode;
};

/** Product image that magnifies under the cursor, following the pointer. */
export function ProductImageZoom({ src, alt, children }: Props) {
  const finePointer = useFinePointer();
  const [lensOn, setLensOn] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const zoomable = finePointer && Boolean(src);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomable) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div
        onMouseEnter={() => zoomable && setLensOn(true)}
        onMouseLeave={() => setLensOn(false)}
        onMouseMove={onMouseMove}
        className={`overflow-hidden ${zoomable ? "cursor-zoom-in" : ""}`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          className="aspect-square w-full object-contain transition-transform duration-200 ease-out"
          style={{
            transform: lensOn ? `scale(${LENS_SCALE})` : "scale(1)",
            transformOrigin: origin,
          }}
        />
      </div>

      {children}
    </div>
  );
}
