import { api } from "./client";
import type { WishlistSummary } from "./types";

export function getWishlist() {
  return api.get<WishlistSummary>("/wishlist");
}

export function addWishlistItem(productId: string) {
  return api.post<WishlistSummary>("/wishlist/items", { productId });
}

export function removeWishlistItem(productId: string) {
  return api.del<WishlistSummary>(`/wishlist/items/${productId}`);
}
