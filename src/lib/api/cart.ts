import { api } from "./client";
import type { CartSummary } from "./types";

export function getCart() {
  return api.get<CartSummary>("/cart");
}

export function addCartItem(input: { productId: string; variantId?: string; planPackageId?: string; qty?: number }) {
  return api.post<CartSummary>("/cart/items", input);
}

export function updateCartItem(itemId: string, qty: number) {
  return api.patch<CartSummary>(`/cart/items/${itemId}`, { qty });
}

export function removeCartItem(itemId: string) {
  return api.del<CartSummary>(`/cart/items/${itemId}`);
}

export function clearCart() {
  return api.del<CartSummary>("/cart");
}
