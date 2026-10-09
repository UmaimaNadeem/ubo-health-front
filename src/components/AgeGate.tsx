import { useEffect, useState } from "react";
import logoOnyx from "../assets/logo-onyx.webp";

// Remembers the shopper's confirmation for 10 days via a cookie that expires
// on its own, after which the gate re-appears.
const COOKIE_NAME = "onyx_age_verified";
const EXPIRY_DAYS = 10;

function isVerified(): boolean {
  try {
    return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=`));
  } catch {
    return false;
  }
}

function setVerified(): void {
  const expires = new Date(Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=1; expires=${expires}; path=/; SameSite=Lax`;
}

export function AgeGate() {
  // Decide only after mount so we never flash the gate for an already-verified
  // visitor (localStorage isn't available during the first render pass).
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isVerified()) setOpen(true);
  }, []);

  // Freeze background scroll while the gate is up.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const accept = () => {
    setVerified();
    setOpen(false);
  };

  const leave = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 text-center shadow-2xl">
        <img src={logoOnyx} alt="ONYX Research" className="mx-auto h-12 w-auto" />

        <h2
          id="age-gate-title"
          className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary"
        >
          Age &amp; Eligibility Confirmation
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          By choosing <strong className="text-foreground">"I Am Over 21 &amp; I Agree,"</strong> you
          confirm that you are 21 or older and that these products are being acquired strictly for
          legitimate scientific research, never for personal use, resale, or human consumption. You
          also agree to our{" "}
          <a
            href="/terms-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent hover:underline"
          >
            Terms &amp; Conditions
          </a>
          . Any misuse of research compounds is strictly prohibited.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={accept}
            className="flex-1 cursor-pointer rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            I Am Over 21 &amp; I Agree
          </button>
          <button
            type="button"
            onClick={leave}
            className="flex-1 cursor-pointer rounded-md border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            Under 21, Leave Site
          </button>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          ONYX Research products are research-grade compounds supplied for research use only. They
          are not approved for human consumption, veterinary use, or any clinical or therapeutic
          application. ONYX Research is not a pharmacy or medical provider and offers no dosing or
          medical guidance.
        </p>
      </div>
    </div>
  );
}
