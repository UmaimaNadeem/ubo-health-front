import { api } from "./client";
import type { PaymentMethod } from "./types";

export function listPaymentMethods() {
  return api.get<PaymentMethod[]>("/payment-methods");
}
