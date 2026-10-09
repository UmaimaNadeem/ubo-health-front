import { api } from "./client";
import type { Order, PaymentSession, PlaceOrderPayload, PlacedOrder } from "./types";

export function placeOrder(payload: PlaceOrderPayload) {
  return api.post<PlacedOrder>("/orders", payload);
}

export function createPaymentSession(orderId: string, email?: string) {
  return api.post<PaymentSession>(`/orders/${orderId}/payment-session`, email ? { email } : undefined);
}

export type SubmitPaymentProofPayload = {
  txHash?: string;
  receipt?: File;
  email?: string;
};

export function submitPaymentProof(orderId: string, payload: SubmitPaymentProofPayload) {
  const form = new FormData();
  if (payload.txHash) form.append("txHash", payload.txHash);
  if (payload.receipt) form.append("receipt", payload.receipt);
  if (payload.email) form.append("email", payload.email);
  return api.postForm<Order>(`/orders/${orderId}/payment-proof`, form);
}

export function listMyOrders() {
  return api.get<Order[]>("/orders");
}

export function getOrder(id: string) {
  return api.get<Order>(`/orders/${id}`);
}

export function lookupOrder(orderNumber: string, email: string) {
  const query = new URLSearchParams({ orderNumber, email });
  return api.get<Order>(`/orders/lookup?${query.toString()}`);
}
