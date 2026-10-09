import type { ReactNode } from "react";
import { Landmark } from "lucide-react";
import {
  UsdtIcon,
  UsdcIcon,
  VisaIcon,
  MastercardIcon,
} from "../components/icons";

export function PaymentDelivery() {
  const paymentMethods = [
    {
      name: "Cryptocurrency",
      brands: [
        <UsdtIcon key="usdt" className="h-7 w-7" />,
        <UsdcIcon key="usdc" className="h-7 w-7" />,
      ] as ReactNode[],
      tag: "Private & fast",
      soon: "",
      coins: [
        { symbol: "USDT", icon: UsdtIcon, label: "Tether — stablecoin pegged 1:1 to USD" },
        { symbol: "USDC", icon: UsdcIcon, label: "USD Coin — fully reserved dollar stablecoin" },
      ],
      detail:
        "Wallet details are shared securely by email once your order is confirmed, for a fast, private, and fully traceable settlement.",
    },
    {
      name: "Credit Card",
      brands: [
        <VisaIcon key="visa" className="h-4 w-auto" />,
        <MastercardIcon key="mastercard" className="h-6 w-auto" />,
      ] as ReactNode[],
      tag: "Fast & convenient",
      soon: "",
      coins: [] as { symbol: string; icon: typeof UsdtIcon; label: string }[],
      detail:
        "Pay securely with Visa, Mastercard, or American Express directly at checkout, no manual transfer required.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-[#0a1733] text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 py-8 2xl:py-24">
          <span className="mb-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            Logistics
          </span>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">Payment &amp; Delivery</h1>
          <p className="mt-4 max-w-xl text-base opacity-80">
            Straightforward payment options, discreet packaging, and reliable tracked shipping to
            most destinations worldwide.
          </p>
        </div>
      </section>

      {/* Payment methods */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            How to pay
          </span>
          <h2 className="mt-2 text-2xl font-black md:text-3xl">Accepted Payment Methods</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            After placing your order you will receive a confirmation email (check your spam folder).
            Note the order amount and number, then complete your payment within{" "}
            <strong>3 days</strong>. Unpaid orders may be cancelled after this period. Always
            include your order number in the transfer reference.
          </p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {paymentMethods.map((m) => (
            <div
              key={m.name}
              className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-7 transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-xl"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative flex items-center gap-4 border-b pb-2">
                {m.brands.length > 0 ? (
                  <div className="flex shrink-0 items-center gap-2">
                    {m.brands.map((brand, i) => (
                      <div
                        key={i}
                        className="flex h-12 min-w-12 items-center justify-center rounded-xl border bg-white px-2 ring-1 ring-inset ring-black/5"
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-12 min-w-12 shrink-0 items-center justify-center rounded-xl border bg-white px-2 text-accent ring-1 ring-inset ring-black/5">
                    <Landmark className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2 ">
                    <h3 className="text-lg font-bold leading-tight">{m.name}</h3>
                    {m.soon && (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                        {m.soon}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {m.tag}
                  </span>
                </div>
              </div>
              {m.coins.length > 0 && (
                <div className="relative mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    We accept
                  </span>
                  {m.coins.map((c) => (
                    <span
                      key={c.symbol}
                      className="inline-flex items-center gap-1.5 rounded-md border border-accent/20 bg-accent/5 px-3 py-0.5 text-xs font-bold tracking-wide text-accent"
                    >
                      <c.icon className="h-3.5 w-3.5" />
                      {c.symbol}
                    </span>
                  ))}
                </div>
              )}
              <p className="relative mt-2 pt-2 text-sm leading-relaxed text-muted-foreground">
                {m.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Packaging & tracking */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border bg-card p-8">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Discreet packaging</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Every order is packed securely in plain, unmarked packaging. No labels, logos, or
                markings indicate the contents. Your privacy is fully protected at every stage of
                transit.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-8">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Full order tracking</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Every shipment includes a tracking number sent to your email on dispatch. Monitor
                your order's journey from our facility to your door in real time.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-8">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Cold-chain integrity</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Peptides are stored in refrigerated environments prior to dispatch. Our proprietary
                stabiliser formulation allows safe transport at ambient temperature for up to 45
                days. Upon receipt, store in a refrigerator to preserve full potency.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-8">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Customs &amp; import</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Import regulations vary by country. We cannot be held responsible for delays or
                seizures caused by customs authorities. It is the buyer's responsibility to verify
                that research peptides may be legally imported into their jurisdiction before
                ordering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-2xl font-black md:text-3xl">Ready to order?</h2>
          <p className="mt-3 text-sm opacity-75">
            Browse our full catalog of research-grade peptides with ≥99% verified purity.
          </p>
          <a
            href="/peptides"
            className="mt-6 inline-block rounded-md bg-accent px-8 py-3 text-sm font-bold text-accent-foreground transition hover:opacity-90"
          >
            Shop peptides
          </a>
        </div>
      </section>
    </div>
  );
}
