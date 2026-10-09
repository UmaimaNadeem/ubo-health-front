import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, CalendarDays } from "lucide-react";
import { usePlan } from "../lib/api";
import { useAuth, useCart } from "../context/contexts";
import { useTimedFlag } from "../hooks/useTimedFlag";
import Price from "../components/Price";

export default function PlanDetail() {
  const { slug = "" } = useParams();
  const { data: plan, isLoading } = usePlan(slug);
  const { addItem } = useCart();
  const { user } = useAuth();
  const planRestricted = user?.role === "retailer" || user?.role === "wholesaler";
  const [heroAdded, flashHeroAdded] = useTimedFlag();
  const [ctaAdded, flashCtaAdded] = useTimedFlag();
  const [addedPackageId, setAddedPackageId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">Loading…</div>
    );
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black">Plan not found</h1>
        <Link to="/peptide-plans" className="mt-4 inline-block text-accent hover:underline">
          Back to peptide plans
        </Link>
      </div>
    );
  }

  const isMultiPackage = plan.planType === "multi_package";

  const addWholePlan = async () => {
    await addItem({ productId: plan.id });
  };

  const addPackage = async (packageId: string) => {
    await addItem({ productId: plan.id, planPackageId: packageId });
    setAddedPackageId(packageId);
    setTimeout(() => setAddedPackageId(null), 1600);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary">
        <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-10 2xl:py-20">
          <nav className="mb-6 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-accent">
              Home
            </Link>{" "}
            /{" "}
            <Link to="/peptide-plans" className="hover:text-accent">
              Peptide Plans
            </Link>{" "}
            / <span className="text-foreground">{plan.name}</span>
          </nav>

          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Peptide Program
              </span>
              <h1 className="text-3xl font-black leading-tight md:text-5xl">{plan.name}</h1>
              <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
                {plan.intro}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {!isMultiPackage && <span className="text-3xl font-black"><Price value={plan.price} /></span>}
                {plan.cycleLength && (
                  <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 text-accent" />
                    {plan.cycleLength}
                  </span>
                )}
              </div>
              {planRestricted ? (
                <p className="mt-6 max-w-xs rounded-xl border border-muted bg-secondary px-4 py-3 text-xs font-medium text-muted-foreground">
                  Peptide plans are available to consumer accounts only.
                </p>
              ) : isMultiPackage ? (
                <a
                  href="#packages"
                  className="group mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/30 transition hover:scale-[1.02] hover:shadow-accent/50"
                >
                  Choose your package
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              ) : (
                <button
                  onClick={async () => {
                    await addWholePlan();
                    flashHeroAdded();
                  }}
                  className={`group mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg transition hover:scale-[1.02] ${
                    heroAdded
                      ? "bg-emerald-600 text-white shadow-emerald-600/30"
                      : "bg-accent text-accent-foreground shadow-accent/30 hover:shadow-accent/50"
                  }`}
                >
                  {heroAdded ? (
                    <>
                      <Check className="h-4 w-4" /> Added
                    </>
                  ) : (
                    <>
                      Add program to cart
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="hidden md:block">
              <div className="relative overflow-hidden rounded-3xl border bg-white shadow-lg">
                <img
                  src={plan.image ?? undefined}
                  alt={plan.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-primary/5 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Overview
            </span>
            <h2 className="mt-2 text-2xl font-black leading-snug md:text-3xl">
              About this program
            </h2>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">{plan.overview}</p>
        </div>
      </section>

      {/* What's included (single-protocol plans) */}
      {plan.included && (
        <section className="bg-secondary">
          <div className="mx-auto max-w-7xl px-4 py-14 md:py-16">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              What's included
            </span>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">Peptides in this program</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {plan.included.map((p) => (
                <Link
                  key={p.slug}
                  to={`/product/${p.slug}`}
                  className="group flex flex-col rounded-2xl border bg-card p-6 transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg"
                >
                  <h3 className="text-lg font-black group-hover:text-accent">{p.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.role}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    View product
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it helps */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">
          Why this combination
        </span>
        <h2 className="mt-2 text-2xl font-black md:text-3xl">How this program helps</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {plan.howItHelps.map((point) => (
            <div key={point} className="flex items-start gap-3 rounded-2xl border bg-card p-5">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                <Check className="h-4 w-4" />
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Conclusion / CTA */}
      <section className="mx-auto max-w-5xl px-4 py-14 md:py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#0a1733] p-8 text-center text-primary-foreground shadow-2xl md:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-[120px]"
          />
          <h2 className="relative text-2xl font-black md:text-3xl">Ready to start?</h2>
          <p className="relative mx-auto mt-3 max-w-2xl text-sm leading-relaxed opacity-75 md:text-base">
            {plan.conclusion}
          </p>
          {planRestricted ? (
            <p className="relative mx-auto mt-7 max-w-sm rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-medium opacity-80">
              Peptide plans are available to consumer accounts only.
            </p>
          ) : isMultiPackage ? (
            <a
              href="#packages"
              className="group relative mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/30 transition hover:scale-[1.02] hover:shadow-accent/50"
            >
              Choose your package
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <button
              onClick={async () => {
                await addWholePlan();
                flashCtaAdded();
              }}
              className={`group relative mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-lg transition hover:scale-[1.02] ${
                ctaAdded
                  ? "bg-emerald-600 text-white shadow-emerald-600/30"
                  : "bg-accent text-accent-foreground shadow-accent/30 hover:shadow-accent/50"
              }`}
            >
              {ctaAdded ? (
                <>
                  <Check className="h-4 w-4" /> Added
                </>
              ) : (
                <>
                  Add program to cart · £{plan.price}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          )}
        </div>
      </section>

    </div>
  );
}
