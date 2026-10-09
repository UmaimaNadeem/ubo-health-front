import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlan, getPlans, getProduct, getProducts, getShippingZones } from "./catalog";
import { createAddress, deleteAddress, listAddresses, updateAddress } from "./addresses";
import { listPaymentMethods } from "./paymentMethods";
import { getGbpToUsdtRate } from "./exchangeRate";
import type { SaveAddressPayload } from "./types";

export function useProducts(params?: { category?: string; search?: string; badge?: string }) {
  return useQuery({
    queryKey: ["products", params ?? {}],
    queryFn: () => getProducts(params),
    staleTime: 60_000,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    enabled: !!slug,
  });
}

export function usePlans() {
  return useQuery({ queryKey: ["plans"], queryFn: getPlans, staleTime: 60_000 });
}

export function usePlan(slug: string) {
  return useQuery({
    queryKey: ["plan", slug],
    queryFn: () => getPlan(slug),
    enabled: !!slug,
  });
}

export function useShippingZones() {
  return useQuery({ queryKey: ["shipping-zones"], queryFn: getShippingZones, staleTime: 5 * 60_000 });
}

export function usePaymentMethods() {
  return useQuery({ queryKey: ["payment-methods"], queryFn: listPaymentMethods, staleTime: 5 * 60_000 });
}

export function useGbpToUsdtRate() {
  return useQuery({
    queryKey: ["exchange-rate", "gbp-usdt"],
    queryFn: getGbpToUsdtRate,
    staleTime: 5 * 60_000,
    select: (data) => data.rate,
  });
}

export function useAddresses(enabled: boolean) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => (await listAddresses()).addresses,
    enabled,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["addresses"] });

  const create = useMutation({
    mutationFn: (payload: SaveAddressPayload) => createAddress(payload),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SaveAddressPayload }) => updateAddress(id, payload),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: invalidate,
  });

  return {
    addresses: query.data ?? [],
    isLoading: query.isLoading,
    create: create.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
  };
}
