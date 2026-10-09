import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ImageOff } from "lucide-react";
import { useWishlist } from "../context/contexts";
import { BADGE_LABELS, visibleBadges } from "../data/data";
import type { Product } from "../lib/api";
import { useTimedFlag } from "../hooks/useTimedFlag";
import Price from "../components/Price";

export function DualChamberPenCard({ product }: { product: Product }) {
  const { toggle, has } = useWishlist();
  const hasVariants = (product.variants?.length ?? 0) > 1;

  const [wishPulsed, flashWish] = useTimedFlag(300);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card transition hover:shadow-lg">
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-white pb-1"
      >
        {!product.image || imageFailed ? (
          <div className="grid h-full w-full place-items-center bg-secondary">
            <ImageOff className="h-8 w-8 text-muted-foreground" aria-hidden />
          </div>
        ) : (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-secondary" aria-hidden />
            )}
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageFailed(true)}
              className={`h-full w-full object-contain transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </>
        )}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
          {product.comingSoon && (
            <span className="rounded-full bg-slate-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Coming soon
            </span>
          )}
          {product.outOfStock && !product.comingSoon && (
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Out of stock
            </span>
          )}
          {visibleBadges(product).map((b) => (
            <span
              key={b}
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${
                b === "new"
                  ? "bg-emerald-600"
                  : b === "bestseller"
                    ? "bg-[#1e3a5f]"
                    : "bg-amber-500"
              }`}
            >
              {BADGE_LABELS[b]}
            </span>
          ))}
        </div>
      </Link>
      <button
        onClick={() => {
          toggle(product.id);
          flashWish();
        }}
        aria-label="Toggle wishlist"
        className="absolute right-3 top-3 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/90 shadow transition-transform hover:bg-white"
      >
        <Heart
          className={`h-4 w-4 transition-transform ${wishPulsed ? "scale-125" : "scale-100"} ${has(product.id) ? "fill-blue-600 text-blue-600" : "text-foreground"}`}
        />
      </button>
      <div className="flex flex-1 flex-col gap-2 border-t px-2 pb-2 pt-1 md:px-4 md:pb-4 md:pt-2">
        <Link
          to={`/product/${product.slug}`}
          className="line-clamp-1 text-[11px] font-semibold hover:text-accent md:text-xs"
        >
          {product.name}
        </Link>
        {product.comingSoon ? (
          <div className="mt-auto">
            <Link
              to="/contact"
              className="block rounded-md border border-accent px-3 py-2 text-center text-xs font-semibold text-accent transition hover:bg-accent hover:text-accent-foreground"
            >
              Notify me
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-auto">
              {product.originalPrice && (
                <span className="mr-2 text-xs text-muted-foreground line-through">
                  £{product.originalPrice}
                </span>
              )}
              <span className="text-sm font-bold text-primary md:text-base">
                {hasVariants ? "From " : ""}
                <Price value={product.price} />
              </span>
            </div>
            {product.outOfStock ? (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-md border border-border bg-secondary px-3 py-2.5 text-sm font-bold text-muted-foreground"
              >
                Out of Stock
              </button>
            ) : (
              <Link
                to={`/product/${product.slug}`}
                className="block w-full cursor-pointer rounded-md bg-accent px-3 py-2.5 text-center text-sm font-bold text-accent-foreground shadow-md shadow-accent/30 transition hover:scale-[1.02] hover:shadow-accent/50"
              >
                View Details
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
