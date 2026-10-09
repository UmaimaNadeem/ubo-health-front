import { Link } from "react-router-dom";
import { usePlans } from "../lib/api";
import Price from "../components/Price";

export function PeptidePlans() {
  const { data: plans = [], isLoading } = usePlans();
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-[#0a1733] text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 pb-8 pt-8 2xl:pb-10 2xl:pt-20">
          <span className="mb-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            Programs
          </span>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">Peptide Plans</h1>
          <p className="mt-4 max-w-2xl text-base opacity-80 md:text-lg">
            Curated multi-peptide programs built around a specific goal, each with the right
            peptides, dosing, and cycle length mapped out for you.
          </p>
          <div className="mt-6 inline-block rounded-xl border border-white/15 bg-white/10 p-4 text-xs leading-relaxed md:text-sm">
            <p className="mb-1 font-bold uppercase tracking-wider">Research Use Only</p>
            <p>
              All ONYX materials are supplied exclusively for legitimate laboratory and
              scientific research. They are not intended for human or veterinary use,
              diagnosis, treatment, or therapeutic application.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">
        {isLoading ? (
          <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
            Loading…
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
            More plans coming soon.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p) => (
              <Link
                key={p.slug}
                to={`/peptide-plans/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  <img
                    src={p.image ?? undefined}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/25" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/50 to-primary/20 transition-opacity group-hover:from-primary/90" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="text-lg font-black group-hover:text-accent">{p.name}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-primary"><Price value={p.price} /></span>
                    <span className="text-sm font-semibold text-accent">View program →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
