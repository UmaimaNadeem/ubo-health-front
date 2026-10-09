import videoHeroMain from "../assets/hero-video.mp4";

export const HERO_VIDEO_PREMIUM = videoHeroMain;

export type Badge = "new" | "bestseller" | "sale";

// Human-readable labels for the badges shown on product cards.
export const BADGE_LABELS: Record<Badge, string> = {
  new: "New",
  bestseller: "BestSeller",
  sale: "Sale",
};

// Badges shown in the UI. Badges are optional — products with none show no tag.
// Duck-typed so it also accepts the API's Product/ProductWithDetail shapes.
export const visibleBadges = (product: { badges?: Badge[] | null }): Badge[] =>
  product.badges ?? [];
