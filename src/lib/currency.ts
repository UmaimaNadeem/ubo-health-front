export type DisplayCurrency =
  | "GBP"
  | "EUR"
  | "SEK"
  | "RUB"
  | "NOK"
  | "DKK"
  | "RON"
  | "HUF"
  | "AED"
  | "CNY";

export const LANGUAGE_CURRENCY: Record<string, DisplayCurrency> = {
  EN: "GBP",

  FR: "EUR",
  ES: "EUR",
  DE: "EUR",
  NL: "EUR",
  BG: "EUR",

  SV: "SEK",
  RU: "RUB",
  NO: "NOK",
  DA: "DKK",
  RO: "RON",
  HU: "HUF",

  AE: "AED",
  ZH: "CNY",
};

export const LANGUAGE_LOCALE: Record<string, string> = {
  EN: "en-GB",
  FR: "fr-FR",
  ES: "es-ES",
  DE: "de-DE",
  SV: "sv-SE",
  RU: "ru-RU",
  NL: "nl-NL",
  NO: "nb-NO",
  DA: "da-DK",
  RO: "ro-RO",
  HU: "hu-HU",
  BG: "bg-BG",
  AE: "ar-AE",
  ZH: "zh-CN",
};

export const LANGUAGE_STORAGE_KEY = "site_lang";
export const CURRENCY_STORAGE_KEY = "site_currency";

export const FX_STORAGE_KEY = "onyx_display_fx";

/**
 * Refresh cached display exchange rates every 6 hours.
 */
export const FX_MAX_AGE_MS =
  6 * 60 * 60 * 1000;

export type CachedFx = {
  base: "GBP";
  rates: Record<string, number>;
  fetched_at?: string | null;
  stale?: boolean;
  cached_at: number;
};

export const currencyForLanguage = (
  languageCode: string,
): DisplayCurrency => {
  return LANGUAGE_CURRENCY[languageCode] ?? "GBP";
};

export const localeForLanguage = (
  languageCode: string,
): string => {
  return LANGUAGE_LOCALE[languageCode] ?? "en-GB";
};

export const readCachedExchangeRates =
  (): CachedFx | null => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const raw =
        localStorage.getItem(FX_STORAGE_KEY);

      if (!raw) return null;

      const parsed =
        JSON.parse(raw) as CachedFx;

      if (
        !parsed?.rates ||
        parsed.base !== "GBP"
      ) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  };

export const writeCachedExchangeRates = (
  exchange: {
    base: string;
    rates: Record<string, number>;
    fetched_at?: string | null;
    stale?: boolean;
  },
): CachedFx => {
  const payload: CachedFx = {
    base: "GBP",

    rates: {
      GBP: 1,
      ...exchange.rates,
    },

    fetched_at: exchange.fetched_at,
    stale: exchange.stale,
    cached_at: Date.now(),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        FX_STORAGE_KEY,
        JSON.stringify(payload),
      );
    } catch {
      // Cache is optional.
    }
  }

  return payload;
};

export const isFxCacheFresh = (
  cache: CachedFx | null,
  currency: DisplayCurrency,
): boolean => {
  if (currency === "GBP") return true;

  if (!cache) return false;

  return Boolean(
    cache.rates[currency] > 0 &&
      Date.now() - cache.cached_at <
        FX_MAX_AGE_MS,
  );
};

export const formatGbpPrice = (
  amount: number | string,
): string => {
  const value = Number(amount);

  const safeValue =
    Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
};

export const formatConvertedGbpPrice = (
  amount: number | string,
  currency: DisplayCurrency,
  rates: Record<string, number>,
  locale: string,
): string => {
  const value = Number(amount);

  const safeValue =
    Number.isFinite(value) ? value : 0;

  if (currency === "GBP") {
    return formatGbpPrice(safeValue);
  }

  const rate = rates[currency];

  /*
   * Never display a GBP number with another
   * currency symbol if conversion failed.
   */
  if (
    typeof rate !== "number" ||
    rate <= 0
  ) {
    return formatGbpPrice(safeValue);
  }

  try {
    const convertedValue =
      safeValue * rate;

    const formatted =
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedValue);

    /*
     * Keep EUR presentation consistent with NadGo.
     * Example:
     * 145,00 € -> €145,00
     */
    if (currency === "EUR") {
      const number = formatted
        .replace(
          /[€\s\u00A0\u202F]/g,
          "",
        )
        .trim();

      return `€${number}`;
    }

    return formatted;
  } catch {
    return formatGbpPrice(safeValue);
  }
};