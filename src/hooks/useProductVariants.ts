import { useEffect, useState } from "react";
import type { ProductWithDetail } from "../lib/api/types";

/**
 * Owns the mg-specification selection state for a product page: which
 * spec is selected, and the gallery/price/stock values that follow from
 * that selection.
 */
export function useProductVariants(product: ProductWithDetail | undefined) {
  const [active, setActive] = useState(0);
  const [variantIdx, setVariantIdx] = useState(0);

  useEffect(() => {
    setActive(0);
    if (!product?.variants?.length) return;
    const firstAvailable = product.variants.findIndex((v) => !v.outOfStock && !v.comingSoon);
    setVariantIdx(firstAvailable >= 0 ? firstAvailable : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.slug]);

  const gallery = product
    ? product.images.length
      ? product.images
      : product.image
        ? [product.image]
        : []
    : [];

  const activeVariants = product?.variants ?? null;
  const selectedVariant = activeVariants?.[variantIdx];

  const activePrice = selectedVariant ? selectedVariant.price : (product?.price ?? 0);
  const effectiveComingSoon =
    (product?.comingSoon ?? false) || (selectedVariant?.comingSoon ?? false);
  const effectiveOutOfStock = selectedVariant
    ? selectedVariant.outOfStock
    : (product?.outOfStock ?? false);

  return {
    active,
    setActive,
    gallery,
    variantIdx,
    setVariantIdx,
    activeVariants,
    selectedVariant,
    activePrice,
    effectiveComingSoon,
    effectiveOutOfStock,
  };
}
