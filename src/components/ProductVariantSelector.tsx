import type { ProductVariant } from "../lib/api/types";
import Price from "./Price";

export function ProductVariantSelector({
  variantIdx,
  onVariantIdxChange,
  variants,
}: {
  variantIdx: number;
  onVariantIdxChange: (idx: number) => void;
  variants: ProductVariant[] | null;
}) {
  if (!variants) return null;

  return (
    <div className="mt-[1.8em]">
      <div className="mb-2 text-[clamp(.75rem,.75vw,.9rem)] text-black/55">
        {variants.length > 1 ? "Select specification" : "Specification"}
      </div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Specification">
        {variants.map((v, i) => {
          const unavailable = v.outOfStock || v.comingSoon;
          return (
            <button
              key={v.label}
              type="button"
              role="radio"
              aria-checked={variantIdx === i}
              disabled={unavailable}
              onClick={() => onVariantIdxChange(i)}
              className={`rounded-full border px-5 py-2 text-[clamp(.75rem,.8vw,.95rem)] transition ${
                unavailable
                  ? "cursor-not-allowed border-black/10 text-black/40 opacity-60"
                  : variantIdx === i
                    ? "cursor-pointer border-black bg-black text-white"
                    : "cursor-pointer border-black/20 hover:border-black"
              }`}
            >
              <>
                {v.label} - <Price value={v.price} />
              </>
              {v.comingSoon ? " (coming soon)" : v.outOfStock ? " (out of stock)" : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
