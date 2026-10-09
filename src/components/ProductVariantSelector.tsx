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
    <div className="mt-6">
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {variants.length > 1 ? "Select specification" : "Specification"}
      </div>
      <div className="flex flex-wrap gap-2">
        {variants.map((v, i) => {
          const unavailable = v.outOfStock || v.comingSoon;
          return (
            <button
              key={v.label}
              disabled={unavailable}
              onClick={() => onVariantIdxChange(i)}
              className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                unavailable
                  ? "cursor-not-allowed border-border text-muted-foreground opacity-50"
                  : variantIdx === i
                    ? "cursor-pointer border-accent bg-accent/10 text-accent"
                    : "cursor-pointer border-border hover:border-accent/60"
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
