import { api } from "./client";

export function getGbpToUsdtRate() {
  return api.get<{ rate: number }>("/exchange-rate/gbp-usdt");
}
