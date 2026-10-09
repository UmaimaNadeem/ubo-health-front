import { api } from "./client";
import type { Plan, PlanDetail, Product, ProductWithDetail, ShippingZone } from "./types";

/**
 * Some catalogue entries carry stray leading/trailing spaces in their name or
 * variant labels, which throws off alphabetical sorting and spacing in the UI.
 */
function normaliseProduct<T extends Product>(p: T): T {
  return {
    ...p,
    name: p.name.trim(),
    variants: p.variants?.map((v) => ({ ...v, label: v.label.trim() })),
  };
}

export async function getProducts(params?: { category?: string; search?: string; badge?: string }) {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.search) query.set("search", params.search);
  if (params?.badge) query.set("badge", params.badge);
  const qs = query.toString();
  const products = await api.get<Product[]>(`/products${qs ? `?${qs}` : ""}`);
  return products.map(normaliseProduct);
}

export async function getProduct(slug: string) {
  const product = await api.get<ProductWithDetail>(`/products/${encodeURIComponent(slug)}`);
  return normaliseProduct(product);
}

export function getPlans() {
  return api.get<Plan[]>("/plans");
}

export function getPlan(slug: string) {
  return api.get<PlanDetail>(`/plans/${encodeURIComponent(slug)}`);
}

export function getShippingZones() {
  return api.get<ShippingZone[]>("/shipping-zones");
}
