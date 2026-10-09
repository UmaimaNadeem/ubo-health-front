import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getDisplayExchangeRates } from "../lib/api/displayExchangeRates";

import {
  CURRENCY_STORAGE_KEY,
  CachedFx,
  DisplayCurrency,
  LANGUAGE_STORAGE_KEY,
  currencyForLanguage,
  formatConvertedGbpPrice,
  formatGbpPrice,
  isFxCacheFresh,
  localeForLanguage,
  readCachedExchangeRates,
  writeCachedExchangeRates,
} from "../lib/currency";

interface CurrencyContextValue {
  /**
   * DISPLAY ONLY.
   *
   * Cart, checkout, orders and payments
   * continue to use GBP internally.
   */
  displayCurrency: DisplayCurrency;

  ratesLoading: boolean;
  hasRate: boolean;
  ratesFetchedAt: string | null;
  ratesStale: boolean;

  setDisplayCurrency: (
    currency: DisplayCurrency,
  ) => void;

  setCurrencyForLanguage: (
    languageCode: string,
  ) => DisplayCurrency;

  /**
   * Convert an authoritative GBP value
   * for display only.
   */
  formatPrice: (
    amount: number | string,
  ) => string;

  /**
   * Always show actual GBP.
   */
  formatGbp: (
    amount: number | string,
  ) => string;

  refreshRates: () => Promise<void>;
}

const CurrencyContext =
  createContext<
    CurrencyContextValue | undefined
  >(undefined);

function readInitialCurrency(): DisplayCurrency {
  if (typeof window === "undefined") {
    return "GBP";
  }

  try {
    const savedCurrency =
      localStorage.getItem(
        CURRENCY_STORAGE_KEY,
      ) as DisplayCurrency | null;

    if (savedCurrency) {
      return savedCurrency;
    }

    const savedLanguage =
      localStorage.getItem(
        LANGUAGE_STORAGE_KEY,
      ) || "EN";

    return currencyForLanguage(
      savedLanguage,
    );
  } catch {
    return "GBP";
  }
}

function readLanguage(): string {
  if (typeof window === "undefined") {
    return "EN";
  }

  try {
    return (
      localStorage.getItem(
        LANGUAGE_STORAGE_KEY,
      ) || "EN"
    );
  } catch {
    return "EN";
  }
}

export const CurrencyProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [
    displayCurrency,
    setDisplayCurrencyState,
  ] = useState<DisplayCurrency>(
    () => readInitialCurrency(),
  );

  const [fx, setFx] =
    useState<CachedFx | null>(
      () => readCachedExchangeRates(),
    );

  const [
    ratesLoading,
    setRatesLoading,
  ] = useState(false);

  const refreshPromiseRef =
    useRef<Promise<void> | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        CURRENCY_STORAGE_KEY,
        displayCurrency,
      );
    } catch {
      // Persistence is optional.
    }
  }, [displayCurrency]);

  const persistCurrency =
    useCallback(
      (currency: DisplayCurrency) => {
        setDisplayCurrencyState(
          currency,
        );

        try {
          localStorage.setItem(
            CURRENCY_STORAGE_KEY,
            currency,
          );
        } catch {
          // Persistence is optional.
        }
      },
      [],
    );

  const refreshRates =
    useCallback(async () => {
      if (
        refreshPromiseRef.current
      ) {
        return refreshPromiseRef.current;
      }

      const task = (async () => {
        setRatesLoading(true);

        try {
          const { exchange } =
            await getDisplayExchangeRates();

          const cached =
            writeCachedExchangeRates(
              exchange,
            );

          setFx(cached);
        } finally {
          setRatesLoading(false);
          refreshPromiseRef.current =
            null;
        }
      })();

      refreshPromiseRef.current =
        task;

      return task;
    }, []);

  const setDisplayCurrency =
    useCallback(
      (
        currency: DisplayCurrency,
      ) => {
        persistCurrency(currency);
      },
      [persistCurrency],
    );

  const setCurrencyForLanguage =
    useCallback(
      (languageCode: string) => {
        const currency =
          currencyForLanguage(
            languageCode,
          );

        persistCurrency(currency);

        return currency;
      },
      [persistCurrency],
    );

  /*
   * Only request FX data when a
   * non-GBP display currency is needed.
   */
  useEffect(() => {
    if (
      displayCurrency === "GBP" ||
      isFxCacheFresh(
        fx,
        displayCurrency,
      )
    ) {
      return;
    }

    void refreshRates().catch(() => {
      /*
       * Display FX must never break
       * the storefront.
       *
       * formatPrice() safely falls
       * back to GBP.
       */
    });
  }, [
    displayCurrency,
    fx,
    refreshRates,
  ]);

  const language =
    readLanguage();

  const locale =
    localeForLanguage(language);

  const hasRate =
    displayCurrency === "GBP" ||
    Boolean(
      fx?.rates?.[
        displayCurrency
      ] &&
        fx.rates[
          displayCurrency
        ] > 0,
    );

  const formatPrice =
    useCallback(
      (
        amount: number | string,
      ) => {
        const formatted =
          formatConvertedGbpPrice(
            amount,
            displayCurrency,
            fx?.rates ?? {
              GBP: 1,
            },
            locale,
          );

        /*
         * ≈ makes it clear that a
         * foreign currency is indicative.
         */
        return displayCurrency !==
          "GBP" && hasRate
          ? `≈ ${formatted}`
          : formatted;
      },
      [
        displayCurrency,
        fx,
        locale,
        hasRate,
      ],
    );

  const value =
    useMemo<CurrencyContextValue>(
      () => ({
        displayCurrency,
        ratesLoading,
        hasRate,

        ratesFetchedAt:
          fx?.fetched_at ?? null,

        ratesStale:
          Boolean(fx?.stale),

        setDisplayCurrency,
        setCurrencyForLanguage,
        formatPrice,
        formatGbp:
          formatGbpPrice,
        refreshRates,
      }),
      [
        displayCurrency,
        ratesLoading,
        hasRate,
        fx?.fetched_at,
        fx?.stale,
        setDisplayCurrency,
        setCurrencyForLanguage,
        formatPrice,
        refreshRates,
      ],
    );

  return (
    <CurrencyContext.Provider
      value={value}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx =
    useContext(CurrencyContext);

  if (!ctx) {
    throw new Error(
      "useCurrency must be used within CurrencyProvider",
    );
  }

  return ctx;
};