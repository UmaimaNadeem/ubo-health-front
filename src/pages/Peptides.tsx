import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import penImage from "../assets/pen.webp";
import vialImage from "../assets/vial.webp";
import { useProducts } from "../lib/api";
import { ProductThumb } from "../components/ProductThumb";
import { Seo } from "../components/Seo";

const PAGE_SIZE = 12;
const VALID_SORTS = [
  "featured",
  "best-selling",
  "new-in",
  "price-asc",
  "price-desc",
  "name",
] as const;
type Sort = (typeof VALID_SORTS)[number];

const FORM_OPTIONS = [
  {
    value: "pen",
    title: "Pen",
    body: "Pre-filled and dual chamber pens for easier use and better preservation",
    image: penImage,
  },
  {
    value: "vial",
    title: "Vial",
    body: "Research grade quality in a traditional, cost effective vial format",
    image: vialImage,
  },
] as const;
type Form = (typeof FORM_OPTIONS)[number]["value"];

// Sort options that filter down to only products carrying the matching badge.
const SORT_BADGE: Partial<Record<Sort, "bestseller" | "new">> = {
  "best-selling": "bestseller",
  "new-in": "new",
};

/** Page numbers around the current page, with gaps collapsed to an ellipsis. */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const shown = [1, total, current, current - 1, current + 1]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b)
    .filter((n, i, arr) => n !== arr[i - 1]);
  return shown.flatMap((n, i) => (i > 0 && n - shown[i - 1] > 1 ? ["gap" as const, n] : [n]));
}

export default function Peptides() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products = [], isLoading } = useProducts();

  const q = (searchParams.get("q") || "").toLowerCase();

  const rawSort = searchParams.get("sort") ?? "featured";
  const sort: Sort = (VALID_SORTS as readonly string[]).includes(rawSort)
    ? (rawSort as Sort)
    : "featured";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const rawForm = searchParams.get("form");
  const form: Form | null = rawForm === "pen" || rawForm === "vial" ? rawForm : null;

  // Clicking the already-selected card clears the filter back to all products.
  function handleForm(value: Form) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (form === value) next.delete("form");
      else next.set("form", value);
      next.delete("page");
      return next;
    });
  }

  function handleSort(value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("sort", value);
      next.delete("page"); // reset to page 1
      return next;
    });
  }

  function handlePage(n: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(n));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  const list = useMemo(() => {
    let base = products.filter((p) => p.category !== "programs");
    if (q)
      base = base.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );

    if (form) base = base.filter((p) => p.type === form);

    const badge = SORT_BADGE[sort];
    if (badge) base = base.filter((p) => p.badges?.includes(badge));

    // Coming-soon products have no settled price yet, so they would skew a
    // price sort (a £0 placeholder lands first on low-to-high).
    if (sort === "price-asc" || sort === "price-desc") {
      base = base.filter((p) => !p.comingSoon);
    }

    const sorted = [...base];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));

    // Featured: isFeatured products first, then in-stock before out-of-stock
    if (sort === "featured") {
      sorted.sort(
        (a, b) =>
          Number(!!b.isFeatured) - Number(!!a.isFeatured) ||
          Number(!!a.outOfStock) - Number(!!b.outOfStock),
      );
    }
    return sorted;
  }, [products, q, sort, form]);

  const totalPages = Math.ceil(list.length / PAGE_SIZE);
  const safePage = Math.min(page, totalPages || 1);
  const paged = list.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const rangeStart = (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, list.length);

  const title = q ? `Results for "${q}"` : "Research Peptides";

  return (
    <div>
      <Seo
        title={`${title} | ONYX Research`}
        description="Research-grade laboratory material with batch-level analytical information. Supplied exclusively for legitimate scientific research."
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-[#0a1733] text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 2xl:py-10">
          <h1 className="text-3xl font-black md:text-4xl">{title}</h1>
          {!q && (
            <div className="mt-4 space-y-3 text-sm leading-relaxed opacity-80 md:text-base">
              <p>
                Every peptide in the ONYX Research catalogue is manufactured to a ≥99% purity
                specification, with each batch independently verified by third-party
                laboratories using HPLC and mass spectrometry. A unique authentication code
                ships with every vial.
              </p>
              <p>
                From metabolic and growth-signalling compounds to tissue-repair and
                neuroendocrine research peptides, every compound is supplied in the format your
                protocol requires: lyophilised powder, pre-mixed solution, or a pre-filled
                dual-chamber delivery pen.
              </p>
              <div className="inline-block rounded-xl border border-white/15 bg-white/10 p-4 text-xs leading-relaxed md:text-sm">
                <p className="mb-1 font-bold uppercase tracking-wider">Research Use Only</p>
                <p>
                  All ONYX materials are supplied exclusively for legitimate laboratory and
                  scientific research. They are not intended for human or veterinary use,
                  diagnosis, treatment, or therapeutic application.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 md:gap-4">
            {FORM_OPTIONS.map((o) => {
              const selected = form === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => handleForm(o.value)}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition md:gap-5 md:p-5 ${
                    selected
                      ? "border-primary bg-card"
                      : "border-transparent bg-secondary hover:border-primary/40"
                  }`}
                >
                  <img
                    src={o.image}
                    alt=""
                    className="h-16 w-20 shrink-0 object-contain md:h-20 md:w-24"
                  />
                  <span>
                    <span className="block text-2xl font-bold text-primary md:text-3xl">
                      {o.title}
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                      {o.body}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-muted-foreground">
              {!isLoading &&
                (list.length === 0
                  ? "No products"
                  : `Showing ${rangeStart} to ${rangeEnd} of ${list.length} products`)}
            </span>
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm sm:w-auto"
            >
              <option value="featured">Featured</option>
              <option value="best-selling">Best Selling</option>
              <option value="new-in">New In</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Alphabetical (A - Z)</option>
            </select>
          </div>
          {isLoading ? (
            <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
              Loading…
            </div>
          ) : list.length === 0 ? (
            <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
              No products found.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
                {paged.map((p) => (
                  <ProductThumb key={p.id} product={p} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-1">
                  <button
                    onClick={() => handlePage(Math.max(1, safePage - 1))}
                    disabled={safePage === 1}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border bg-card text-sm transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ‹
                  </button>
                  {pageWindow(safePage, totalPages).map((n, i) =>
                    n === "gap" ? (
                      <span
                        key={`gap-${i}`}
                        className="flex h-9 w-6 items-center justify-center text-sm text-muted-foreground"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => handlePage(n)}
                        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition ${
                          n === safePage
                            ? "border-accent bg-accent text-accent-foreground"
                            : "bg-card hover:border-accent"
                        }`}
                      >
                        {n}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() => handlePage(Math.min(totalPages, safePage + 1))}
                    disabled={safePage === totalPages}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border bg-card text-sm transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
