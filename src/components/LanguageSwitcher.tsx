import { useEffect, useRef, useState } from "react";
import { useCurrency } from "../context/CurrencyContext";

type Lang = {
  code: string;
  label: string;
  flag: string;
  gt: string;
  dir?: "ltr" | "rtl";
};

const LANGS: Lang[] = [
  { code: "EN", label: "English", flag: "gb", gt: "en" },
  { code: "FR", label: "French", flag: "fr", gt: "fr" },
  { code: "ES", label: "Spanish", flag: "es", gt: "es" },
  { code: "DE", label: "German", flag: "de", gt: "de" },
  { code: "SV", label: "Swedish", flag: "se", gt: "sv" },
  { code: "RU", label: "Russian", flag: "ru", gt: "ru" },
  { code: "NL", label: "Dutch", flag: "nl", gt: "nl" },
  { code: "NO", label: "Norwegian", flag: "no", gt: "no" },
  { code: "DA", label: "Danish", flag: "dk", gt: "da" },
  { code: "RO", label: "Romanian", flag: "ro", gt: "ro" },
  { code: "HU", label: "Hungarian", flag: "hu", gt: "hu" },
  { code: "BG", label: "Bulgarian", flag: "bg", gt: "bg" },
  { code: "AE", label: "Arabic (UAE)", flag: "ae", gt: "ar", dir: "rtl" },
  { code: "ZH", label: "Chinese", flag: "cn", gt: "zh-CN" },
];

const STORAGE_KEY = "site_lang";
const GOOGLE_SELECT_SELECTOR = ".goog-te-combo";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            autoDisplay: boolean;
          },
          container: string,
        ) => void;
      };
    };
  }
}

const waitForGoogleSelect = (
  timeout = 8000,
): Promise<HTMLSelectElement | null> => {
  const existing =
    document.querySelector<HTMLSelectElement>(GOOGLE_SELECT_SELECTOR);

  if (existing) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve) => {
    const startedAt = Date.now();

    const timer = window.setInterval(() => {
      const select =
        document.querySelector<HTMLSelectElement>(GOOGLE_SELECT_SELECTOR);

      if (select || Date.now() - startedAt > timeout) {
        window.clearInterval(timer);
        resolve(select);
      }
    }, 100);
  });
};

const injectGoogleTranslate = () => {
  if (document.getElementById("google-translate-script")) {
    return waitForGoogleSelect();
  }

  if (!document.getElementById("google_translate_element")) {
    const div = document.createElement("div");

    div.id = "google_translate_element";

    div.style.cssText =
      "position:absolute;left:-9999px;top:-9999px;visibility:hidden;";

    document.body.appendChild(div);
  }

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate) return;

    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
      },
      "google_translate_element",
    );
  };

  const script = document.createElement("script");

  script.id = "google-translate-script";
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;

  document.body.appendChild(script);

  return waitForGoogleSelect();
};

const setGoogleLang = (gt: string) => {
  const host = window.location.hostname;

  const value = gt === "en" ? "/en/en" : `/en/${gt}`;

  const expires = new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000,
  ).toUTCString();

  document.cookie =
    `googtrans=${value}; ` +
    `expires=${expires}; ` +
    `path=/; SameSite=Lax`;

  const parts = host.split(".");

  if (parts.length > 1) {
    const parent = "." + parts.slice(-2).join(".");

    document.cookie =
      `googtrans=${value}; ` +
      `expires=${expires}; ` +
      `path=/; domain=${parent}; SameSite=Lax`;
  }
};

const applyGoogleTranslate = async (gt: string) => {
  setGoogleLang(gt);

  if (gt === "en") return;

  const select = await injectGoogleTranslate();

  if (!select) return;

  select.value = gt;

  select.dispatchEvent(
    new Event("change", {
      bubbles: true,
    }),
  );
};

const LanguageSwitcher = ({
  className = "",
}: {
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Lang>(LANGS[0]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { setCurrencyForLanguage } = useCurrency();

  useEffect(() => {
  const saved =
    localStorage.getItem(
      STORAGE_KEY,
    );

  const lang =
    LANGS.find(
      (l) => l.code === saved,
    ) || LANGS[0];

  setCurrent(lang);

  document.documentElement.setAttribute(
    "lang",
    lang.gt,
  );

  document.documentElement.setAttribute(
    "dir",
    lang.dir === "rtl"
      ? "rtl"
      : "ltr",
  );

  /*
   * Sync display currency with
   * currently selected language.
   */
  setCurrencyForLanguage(
    lang.code,
  );

  void applyGoogleTranslate(
    lang.gt,
  );
}, [setCurrencyForLanguage]);

  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      if (
        !wrapRef.current?.contains(
          e.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const applyLang = (lang: Lang) => {
    document.documentElement.setAttribute(
      "lang",
      lang.gt,
    );

    document.documentElement.setAttribute(
      "dir",
      lang.dir === "rtl" ? "rtl" : "ltr",
    );

    localStorage.setItem(
  STORAGE_KEY,
  lang.code,
);

/*
 * Change DISPLAY currency before
 * reloading into the translated site.
 */
setCurrencyForLanguage(
  lang.code,
);

setGoogleLang(lang.gt);

window.location.reload();
  };

  const select = (lang: Lang) => {
    setCurrent(lang);
    setOpen(false);
    applyLang(lang);
  };

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      dir="ltr"
    >
      <button
        type="button"
        aria-label={`Language: ${current.label}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="notranslate inline-flex h-10 items-center justify-center gap-1 rounded-sm px-1.5 transition-colors hover:bg-transparent"
        translate="no"
      >
        <span
          className={`fi fi-${current.flag} rounded-sm`}
          style={{
            width: "1.5rem",
            height: "1.1rem",
          }}
        />

        <span className="text-[10px] font-bold leading-none tracking-wide">
          {current.code}
        </span>
      </button>

      <div
        role="menu"
        className={`absolute right-0 top-full z-50 mt-2 min-w-[190px] overflow-hidden rounded-xl border border-border bg-background shadow-xl transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <ul
          className="notranslate py-1"
          translate="no"
        >
          {LANGS.map((lang) => {
            const active =
              lang.code === current.code;

            return (
              <li key={lang.code}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => select(lang)}
                  className={`flex w-full items-center gap-3 border-l-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-primary/10 ${
                    active
                      ? "border-primary bg-primary/5 font-semibold text-primary"
                      : "border-transparent text-foreground"
                  }`}
                >
                  <span
                    className={`fi fi-${lang.flag} rounded-sm`}
                    style={{
                      width: "1.25rem",
                      height: "0.9rem",
                    }}
                  />

                  <span className="font-medium">
                    ({lang.code}) {lang.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSwitcher;