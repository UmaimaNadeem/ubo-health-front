import { api } from "./client";

export interface DisplayExchangeRates {
  base: string;
  rates: Record<string, number>;
  fetched_at?: string | null;
  stale?: boolean;
}

export function getDisplayExchangeRates() {
  return api.get<{
    exchange: DisplayExchangeRates;
  }>("/exchange-rates");
}