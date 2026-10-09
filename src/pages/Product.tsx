import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  FlaskConical,
  CheckCircle2,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Activity,
  Bell,
  FileCheck2,
  Microscope,
  Dna,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";
import { BADGE_LABELS, visibleBadges } from "../data/data";
import { certificateUrl } from "../data/certificates";
import { useProduct, useProducts } from "../lib/api";
import { useCart, useWishlist } from "../context/contexts";
import { ProductThumb } from "../components/ProductThumb";
import { ProductImageZoom } from "../components/ProductImageZoom";
import { useTimedFlag } from "../hooks/useTimedFlag";
import { useProductVariants } from "../hooks/useProductVariants";
import Price from "../components/Price";
import { Seo } from "../components/Seo";
import { ProductVariantSelector } from "../components/ProductVariantSelector";

const TECHNICAL_APPLICATIONS = [
  {
    icon: FlaskConical,
    title: "In-Vitro Binding & Interaction Assays",
    body: "Suitable for laboratory studies examining interactions with relevant receptors, proteins, enzymes, and other molecular targets.",
  },
  {
    icon: ShieldCheck,
    title: "Stability Studies",
    body: "Used in controlled studies evaluating compound stability under defined laboratory and environmental conditions.",
  },
  {
    icon: Microscope,
    title: "Analytical Characterisation",
    body: "Applicable to analytical workflows examining identity, purity, composition, and physicochemical characteristics.",
  },
  {
    icon: Activity,
    title: "Cell-Based Assays",
    body: "Suitable for in-vitro experimental models investigating cellular responses and associated molecular pathways.",
  },
  {
    icon: CheckCircle2,
    title: "Degradation & Integrity Studies",
    body: "Can be incorporated into laboratory studies examining degradation profiles and molecular integrity under controlled conditions.",
  },
  {
    icon: Dna,
    title: "Molecular Interaction Studies",
    body: "Applicable to experimental research investigating interactions between compounds and relevant biological or molecular targets.",
  },
  {
    icon: ClipboardCheck,
    title: "Method Development & Validation",
    body: "Suitable for developing and evaluating analytical methods, laboratory procedures, and experimental workflows.",
  },
  {
    icon: BarChart3,
    title: "Comparative Laboratory Research",
    body: "Can be incorporated into controlled experimental designs comparing compounds, formulations, concentrations, or laboratory conditions.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-semibold hover:bg-secondary"
      >
        {q}
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-accent" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="border-t px-6 py-4 text-sm leading-relaxed text-muted-foreground">{a}</div>
      )}
    </div>
  );
}

export default function Product() {
  const { slug = "" } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: allProducts = [] } = useProducts();
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, flashAdded] = useTimedFlag();
  const [addError, flashAddError] = useTimedFlag(3000);
  const [wishPulsed, flashWish] = useTimedFlag(300);
  const {
    active,
    setActive,
    gallery,
    variantIdx,
    setVariantIdx,
    activeVariants,
    selectedVariant,
    activePrice,
    effectiveComingSoon,
    effectiveOutOfStock,
  } = useProductVariants(product);

  useEffect(() => {
    setQty(1);
  }, [slug]);

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black">Product not found</h1>
        <Link to="/peptides" className="mt-4 inline-block text-accent hover:underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  // Multi-peptide programs use their own dedicated layout.
  if (product.category === "programs") {
    return <Navigate to={`/peptide-plans/${product.slug}`} replace />;
  }

  const detail = product.detail;
  const infoBlocks = [
    ...(detail?.info ?? []),
    ...(detail?.conclusion ? [{ title: "Conclusion", body: detail.conclusion }] : []),
  ];
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const linked = product.linkedProduct;
  const coaUrl = certificateUrl(product.id, selectedVariant?.id);

  return (
    <div>
      <Seo
        title={`${product.name} | ONYX Research`}
        description={`${product.name} — research-grade laboratory material with batch-level analytical information. Supplied exclusively for legitimate scientific research.`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          ...(product.image ? { image: product.image } : {}),
          description:
            "Research-grade laboratory material with batch-level analytical information. Supplied exclusively for legitimate scientific research.",
          brand: {
            "@type": "Organization",
            name: "ONYX Research",
          },
        }}
      />
      {/* ── Breadcrumb ── */}
      <div className="border-b bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-3 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-accent">
            Home
          </Link>
          {" / "}
          <Link to="/peptides" className="hover:text-accent">
            Peptides
          </Link>
          {" / "}
          <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      {/* ── Hero: image + buy box ── */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <ProductImageZoom src={gallery[active]} alt={product.name}>
            <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
              {visibleBadges(product).map((b) => (
                <span
                  key={b}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow ${
                    b === "new"
                      ? "bg-emerald-600"
                      : b === "bestseller"
                        ? "bg-[#1e3a5f]"
                        : "bg-amber-500"
                  }`}
                >
                  {BADGE_LABELS[b]}
                </span>
              ))}
            </div>
          </ProductImageZoom>
          {gallery.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-white p-1.5 transition hover:border-accent ${active === i ? "border-accent ring-2 ring-accent/30" : ""}`}
                >
                  <img
                    src={g}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy box */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-3 sm:block">
            <h1 className="text-xl font-black leading-tight sm:text-3xl md:text-4xl">
              {product.name}
            </h1>

            {effectiveComingSoon ? (
              <div className="shrink-0 sm:mt-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-accent">
                  <Sparkles className="h-4 w-4" />
                  Coming soon
                </span>
              </div>
            ) : (
              <div className="flex shrink-0 flex-col items-end gap-1 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3">
                <span className="text-2xl font-black text-primary sm:text-4xl">
                  <Price value={activePrice} />
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      <Price value={product.originalPrice} />
                    </span>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
                {effectiveOutOfStock && (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
                    Out of stock
                  </span>
                )}
              </div>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {product.type && linked && (
            <div className="mt-6">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Select variant
              </div>
              <div className="flex flex-wrap gap-2">
                {(["pen", "vial"] as const).map((form) =>
                  form === product.type ? (
                    <span
                      key={form}
                      className="rounded-xl border border-accent bg-accent/10 px-6 py-2.5 text-sm font-semibold capitalize text-accent"
                    >
                      {form}
                    </span>
                  ) : (
                    <Link
                      key={form}
                      to={`/product/${linked.slug}`}
                      className="rounded-xl border border-border px-6 py-2.5 text-sm font-semibold capitalize transition hover:border-accent/60"
                    >
                      {form}
                    </Link>
                  ),
                )}
              </div>
            </div>
          )}

          <ProductVariantSelector
            variantIdx={variantIdx}
            onVariantIdxChange={setVariantIdx}
            variants={activeVariants}
          />

          {/* Key features quick list */}
          {/* {detail && (
            <ul className="mt-5 space-y-1.5">
              {detail.features.slice(0, 4).map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          )} */}

          {/* Add to cart / coming soon */}
          {effectiveComingSoon ? (
            <div className="mt-6 flex items-center gap-3">
              <Link
                to="/contact"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/30 transition hover:scale-[1.01] hover:shadow-accent/50"
              >
                <Bell className="h-4 w-4" />
                Notify me
              </Link>
              <button
                onClick={() => {
                  toggle(product.id);
                  flashWish();
                }}
                aria-label="Wishlist"
                className="grid h-12 w-12 cursor-pointer place-items-center rounded-xl border transition hover:bg-secondary"
              >
                <Heart
                  className={`h-5 w-5 transition-transform ${wishPulsed ? "scale-125" : "scale-100"} ${has(product.id) ? "fill-blue-600 text-blue-600" : ""}`}
                />
              </button>
            </div>
          ) : effectiveOutOfStock ? (
            <div className="mt-6 flex items-center gap-3">
              <button
                disabled
                className="flex-1 cursor-not-allowed rounded-xl border border-border bg-secondary px-6 py-3.5 text-sm font-bold text-muted-foreground"
              >
                Out of Stock
              </button>
              <button
                onClick={() => {
                  toggle(product.id);
                  flashWish();
                }}
                aria-label="Wishlist"
                className="grid h-12 w-12 cursor-pointer place-items-center rounded-xl border transition hover:bg-secondary"
              >
                <Heart
                  className={`h-5 w-5 transition-transform ${wishPulsed ? "scale-125" : "scale-100"} ${has(product.id) ? "fill-blue-600 text-blue-600" : ""}`}
                />
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="grid h-12 w-12 place-items-center rounded-l-xl hover:bg-secondary"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="grid h-12 w-12 place-items-center rounded-r-xl hover:bg-secondary"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  disabled={isAdding}
                  onClick={async () => {
                    setIsAdding(true);
                    try {
                      await addItem({ productId: product.id, variantId: selectedVariant?.id, qty });
                      flashAdded();
                    } catch (err) {
                      console.error("Failed to add to cart", err);
                      flashAddError();
                    } finally {
                      setIsAdding(false);
                    }
                  }}
                  className={`flex-1 cursor-pointer rounded-xl border px-6 py-3.5 text-sm font-bold transition disabled:cursor-not-allowed ${
                    justAdded || isAdding
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {isAdding ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Adding…
                    </span>
                  ) : justAdded ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="h-4 w-4" /> Added
                    </span>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
                <button
                  onClick={() => {
                    toggle(product.id);
                    flashWish();
                  }}
                  aria-label="Wishlist"
                  className="grid h-12 w-12 cursor-pointer place-items-center rounded-xl border transition hover:bg-secondary"
                >
                  <Heart
                    className={`h-5 w-5 transition-transform ${wishPulsed ? "scale-125" : "scale-100"} ${has(product.id) ? "fill-blue-600 text-blue-600" : ""}`}
                  />
                </button>
              </div>
              {addError && (
                <p className="text-sm text-red-600">
                  Something went wrong adding this to your cart. Please try again.
                </p>
              )}
              <button
                onClick={async () => {
                  try {
                    await addItem({ productId: product.id, variantId: selectedVariant?.id, qty });
                    navigate("/checkout");
                  } catch (err) {
                    console.error("Failed to add to cart", err);
                    flashAddError();
                  }
                }}
                className="w-full cursor-pointer rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/30 transition hover:scale-[1.01] hover:shadow-accent/50"
              >
                Buy Now
              </button>
            </div>
          )}

          {coaUrl && (
            <a
              href={coaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 self-start py-2 text-base font-bold text-accent transition hover:underline"
            >
              <FileCheck2 className="h-5 w-5" />
              View Certificate of Authenticity
            </a>
          )}

          {/* Trust signals */}
          <ul className="mt-8 space-y-3 border-t pt-6 text-sm">
            <li className="flex items-center gap-3 text-muted-foreground">
              <FlaskConical className="h-5 w-5 shrink-0 text-accent" /> Research grade · ≥99% purity
              (HPLC verified)
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <ShieldCheck className="h-5 w-5 shrink-0 text-accent" /> Third-party verified · unique
              batch authentication code
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <Truck className="h-5 w-5 shrink-0 text-accent" /> Discreet EU dispatch · tracked on
              every order
            </li>
          </ul>

          {/* Research notice */}
          <div className="mt-6 rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <strong>For research use only.</strong> Not approved for human consumption, food,
            veterinary, or drug use. By purchasing you confirm you are a qualified researcher.
          </div>
        </div>
      </section>

      {/* ── Peptide Profile ── */}
      {detail?.profile && detail.profile.length > 0 && (
        <section className="bg-secondary">
          <div className="mx-auto max-w-7xl px-4 py-14">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Compound data
            </span>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">Peptide Profile</h2>
            <div className="mt-8 overflow-hidden rounded-2xl border bg-card">
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  {detail.profile.map((row) => (
                    <tr key={row.label} className="transition hover:bg-secondary/50">
                      <td className="w-44 px-6 py-4 font-semibold text-foreground">{row.label}</td>
                      <td
                        className={`px-6 py-4 ${row.label === "Storage" ? "font-medium text-foreground" : "text-muted-foreground"}`}
                      >
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── What Is It ── */}
      {detail?.summary && (
        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Overview
              </span>
              <h2 className="mt-2 text-2xl font-black leading-snug md:text-3xl">
                About this product
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">{detail.summary}</p>
          </div>
        </section>
      )}

      {/* ── How it works ── */}
      {detail?.steps && detail.steps.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-secondary to-background">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent/10 blur-[150px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-sky-500/10 blur-[150px]"
          />
          <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                Mechanism
              </span>
              <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                How it works
              </h2>
            </div>

            <div className="mt-14 grid items-center gap-12 md:grid-cols-2 md:gap-16">
              {detail.diagram && (
                <div className="relative md:sticky md:top-28">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-accent/20 via-sky-400/10 to-transparent opacity-70 blur-2xl"
                  />
                  <div className="relative rounded-3xl border bg-white p-6 shadow-xl md:p-8">
                    <img
                      src={detail.diagram}
                      alt={`${product.name} mechanism diagram`}
                      width={396}
                      height={480}
                      loading="lazy"
                      className="mx-auto w-full max-w-sm object-contain"
                    />
                  </div>
                </div>
              )}

              <ol className="relative space-y-8">
                <span
                  aria-hidden
                  className="absolute bottom-4 left-[1.125rem] top-4 w-px bg-gradient-to-b from-accent/50 via-border to-transparent"
                />
                {detail.steps.map((s, i) => (
                  <li key={s.title} className="relative flex gap-5">
                    <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-sky-400 text-sm font-black text-accent-foreground ring-4 ring-background">
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="font-bold tracking-tight text-foreground">{s.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {detail.note && (
              <div className="mt-14 flex items-start gap-4 rounded-2xl border border-accent/30 bg-accent/5 p-6 md:p-7">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent ring-1 ring-inset ring-accent/20">
                  <Sparkles className="h-5 w-5" />
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  <strong className="font-bold text-foreground">Why it matters: </strong>
                  {detail.note}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Technical & Laboratory Applications ── */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">
          Applications
        </span>
        <h2 className="mt-2 text-2xl font-black md:text-3xl">
          Technical &amp; Laboratory Applications
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Designed for controlled laboratory research, research compounds may be evaluated
          across a range of analytical, biochemical, and experimental applications.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TECHNICAL_APPLICATIONS.map((a) => (
            <div key={a.title} className="rounded-2xl border p-5 text-center md:p-6">
              <a.icon className="mx-auto h-12 w-12 text-accent" />
              <h3 className="mt-4 text-lg font-bold">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Usage / storage info (conclusion folds in here as a plain card, same as
          any other info block, instead of a dedicated section only some products have) ── */}
      {infoBlocks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-5">
            {infoBlocks.map((b) => (
              <div key={b.title} className="rounded-2xl border bg-card p-6">
                <h3 className="text-lg font-bold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {detail?.faqs && detail.faqs.length > 0 && (
        <section className="bg-secondary">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">FAQs</span>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">Frequently Asked Questions</h2>
            <div className="mt-8 space-y-3">
              {detail.faqs.map((f) => (
                <FAQItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related products ── */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="mb-6 text-2xl font-black">Related products</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductThumb key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
