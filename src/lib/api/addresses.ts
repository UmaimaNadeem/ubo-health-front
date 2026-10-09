import { api } from "./client";
import type { Address, SaveAddressPayload } from "./types";

export function listAddresses() {
  return api.get<{ addresses: Address[] }>("/addresses");
}

export function createAddress(payload: SaveAddressPayload) {
  return api.post<Address>("/addresses", payload);
}

export function updateAddress(id: string, payload: SaveAddressPayload) {
  return api.patch<Address>(`/addresses/${id}`, payload);
}

export function deleteAddress(id: string) {
  return api.del<{ success: boolean }>(`/addresses/${id}`);
}
