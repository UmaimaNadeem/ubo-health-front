import { api } from "./client";

export type CouponValidation = { valid: boolean; discountAmount: number };

export function validateCoupon(code: string, subtotal: number) {
  return api.post<CouponValidation>("/coupons/validate", { code, subtotal });
}
