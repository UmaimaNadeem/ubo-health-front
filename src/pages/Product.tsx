import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
  ChevronRight,
  ArrowRight,
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

/* Same type/layout scale as the treatment pages (measured from the 1904px reference). */
const NARROW = "mx-auto w-full max-w-[1544px] px-4 sm:px-8 min-[1700px]:px-0";
const WIDE = "mx-auto w-full max-w-[1806px] px-4 sm:px-6 min-[1700px]:px-0";
const H2 = "font-heading font-normal leading-[1.2] text-[clamp(1.6rem,2.3vw,2.75rem)]";
const BODY = "text-[clamp(.85rem,.9vw,1.1rem)]";
const SMALL = "text-[clamp(.75rem,.75vw,.9rem)]";
const RADIUS = "rounded-[clamp(1.75rem,2.5vw,3rem)]";
const CARD_R = "rounded-[clamp(1.25rem,1.6vw,1.9rem)]";
const EASE = [0.22, 1, 0.36, 1] as const;
const CARD_BG = "linear-gradient(180deg,#f6f6f8 0%,#e1e6fb 100%)";

const rise = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: EASE },
} as const;

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

function SectionHead({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <motion.div {...rise} className="mx-auto max-w-[44rem] text-center">
      <p className={`text-black/55 ${SMALL}`}>{eyebrow}</p>
      <h2 className={`${H2} mt-[0.6em]`}>{title}</h2>
      {body && <p className={`mt-4 leading-relaxed text-black/60 ${SMALL}`}>{body}</p>}
    </motion.div>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-4 py-[clamp(1rem,1.5vw,1.75rem)] text-left ${BODY}`}
      >
        {q}
        {open ? <Minus className="h-4 w-4 shrink-0" /> : <Plus className="h-4 w-4 shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={`overflow-hidden pb-5 leading-relaxed text-black/60 ${SMALL}`}
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
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
        <h1 className={H2}>Product not found</h1>
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

  const wishButton = (
    <button
      onClick={() => {
        toggle(product.id);
        flashWish();
      }}
      aria-label="Wishlist"
      className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full border border-black/20 transition hover:border-black md:h-11 md:w-11"
    >
      <Heart
        className={`h-4 w-4 transition-transform ${wishPulsed ? "scale-125" : "scale-100"} ${has(product.id) ? "fill-[#2b52e6] text-[#2b52e6]" : ""}`}
      />
    </button>
  );

  const pill = "inline-flex h-10 items-center justify-center rounded-full px-6 text-[15px] md:h-11 min-[1500px]:text-[17px]";

  return (
    <div className="overflow-x-clip bg-white font-body text-black">
      <Seo
        title={`${product.name} | OBU Health`}
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
            name: "OBU Health",
          },
        }}
      />

      {/* ── Hero: gallery + buy box ── */}
      <section className={`${NARROW} pt-[clamp(1rem,1.9vw,2.2rem)]`}>
        <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-black/50 ${SMALL}`}>
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/peptides" className="hover:text-black">
            Peptides
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="mt-[clamp(1rem,1.7vw,2rem)] grid gap-[clamp(1.5rem,3.8vw,4.5rem)] lg:grid-cols-[645fr_813fr]">
          {/* Gallery */}
          <div className="space-y-2 lg:sticky lg:top-28 lg:self-start">
            <ProductImageZoom
              src={gallery[active]}
              alt={product.name}
              frameClassName={`${CARD_R}`}
              frameStyle={{ background: CARD_BG }}
              imgClassName="aspect-[645/605] p-[6%]"
            >
              <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
                {visibleBadges(product).map((b) => (
                  <span
                    key={b}
                    className={`rounded-full px-3 py-1 text-[11px] font-normal uppercase tracking-wider text-white ${
                      b === "new" ? "bg-emerald-600" : b === "bestseller" ? "bg-black" : "bg-amber-500"
                    }`}
                  >
                    {BADGE_LABELS[b]}
                  </span>
                ))}
              </div>
            </ProductImageZoom>
            {gallery.length > 1 && (
              <div className="grid grid-cols-2 gap-2">
                {gallery.slice(0, 4).map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={active === i}
                    className={`aspect-[320/327] overflow-hidden border p-[8%] transition ${CARD_R} ${
                      active === i ? "border-black" : "border-transparent hover:border-black/20"
                    }`}
                    style={{ background: CARD_BG }}
                  >
                    <img src={g} alt="" loading="lazy" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-col lg:sticky lg:top-28 lg:self-start"
          >
            <h1 className={`${H2} max-w-[16em]`}>{product.name}</h1>

            <p className={`mt-[1.4em] max-w-[40em] leading-relaxed text-black/65 ${BODY}`}>
              {product.description}
            </p>

            {effectiveComingSoon ? (
              <div className="mt-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-1.5 text-sm">
                  <Sparkles className="h-4 w-4" />
                  Coming soon
                </span>
              </div>
            ) : (
              <>
                <p className={`mt-[1.4em] flex items-center gap-2 text-black/60 ${SMALL}`}>
                  <span className={`h-2 w-2 rounded-full ${effectiveOutOfStock ? "bg-red-500" : "bg-[#3fae6a]"}`} />
                  {effectiveOutOfStock ? "Out of stock" : "In stock"}
                </p>
                <p className="mt-2 flex flex-wrap items-baseline gap-3 font-heading text-[clamp(2rem,2.6vw,3.1rem)] font-normal leading-none">
                  <Price value={activePrice} />
                  {product.originalPrice && (
                    <>
                      <span className={`font-body text-black/40 line-through ${BODY}`}>
                        <Price value={product.originalPrice} />
                      </span>
                      <span className="rounded-full bg-black px-2.5 py-1 font-body text-xs text-white">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </p>
              </>
            )}

            {product.type && linked && (
              <div className="mt-[1.8em]">
                <div className={`mb-2 text-black/55 ${SMALL}`}>Select variant</div>
                <div className="flex flex-wrap gap-2">
                  {(["pen", "vial"] as const).map((form) =>
                    form === product.type ? (
                      <span
                        key={form}
                        className={`rounded-full border border-black bg-black px-5 py-2 capitalize text-white ${SMALL}`}
                      >
                        {form}
                      </span>
                    ) : (
                      <Link
                        key={form}
                        to={`/product/${linked.slug}`}
                        className={`rounded-full border border-black/20 px-5 py-2 capitalize transition hover:border-black ${SMALL}`}
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

            {/* Add to cart / coming soon */}
            {effectiveComingSoon ? (
              <div className="mt-[2em] flex items-center gap-2">
                <Link to="/contact" className={`${pill} gap-2 bg-black text-white transition hover:bg-black/75`}>
                  <Bell className="h-4 w-4" />
                  Notify me
                </Link>
                {wishButton}
              </div>
            ) : effectiveOutOfStock ? (
              <div className="mt-[2em] flex items-center gap-2">
                <button
                  disabled
                  className={`${pill} cursor-not-allowed border border-black/10 bg-secondary text-black/40`}
                >
                  Out of Stock
                </button>
                {wishButton}
              </div>
            ) : (
              <div className="mt-[2em] space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 items-center rounded-full border border-black/20 md:h-11">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      aria-label="Decrease quantity"
                      className="grid h-full w-10 place-items-center rounded-l-full hover:bg-secondary md:w-11"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      aria-label="Increase quantity"
                      className="grid h-full w-10 place-items-center rounded-r-full hover:bg-secondary md:w-11"
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
                    className={`${pill} flex-1 cursor-pointer border border-black transition disabled:cursor-not-allowed ${
                      justAdded || isAdding ? "bg-black text-white" : "bg-transparent text-black hover:bg-black hover:text-white"
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
                  {wishButton}
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
                  className="group flex w-full cursor-pointer items-center gap-2 text-white"
                >
                  <span className={`${pill} flex-1 bg-[#2b52e6] transition group-hover:bg-[#1f3fc0]`}>Buy Now</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2b52e6] transition group-hover:bg-[#1f3fc0] md:h-11 md:w-11">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              </div>
            )}

            {coaUrl && (
              <a
                href={coaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 flex items-center gap-2 self-start py-2 underline underline-offset-4 transition hover:text-[#2b52e6] ${BODY}`}
              >
                <FileCheck2 className="h-5 w-5" strokeWidth={1.5} />
                View Certificate of Authenticity
              </a>
            )}

            {/* Trust signals */}
            <ul className={`mt-[2em] space-y-[0.9em] border-t border-black/10 pt-[1.6em] ${BODY}`}>
              <li className="flex items-start gap-3 text-black/70">
                <FlaskConical className="mt-[0.2em] h-[1em] w-[1em] shrink-0" strokeWidth={1.5} />
                Research grade · ≥99% purity (HPLC verified)
              </li>
              <li className="flex items-start gap-3 text-black/70">
                <ShieldCheck className="mt-[0.2em] h-[1em] w-[1em] shrink-0" strokeWidth={1.5} />
                Third-party verified · unique batch authentication code
              </li>
              <li className="flex items-start gap-3 text-black/70">
                <Truck className="mt-[0.2em] h-[1em] w-[1em] shrink-0" strokeWidth={1.5} />
                Discreet EU dispatch · tracked on every order
              </li>
            </ul>

            {/* Research notice */}
            <div className={`mt-6 ${CARD_R} bg-[#f6f1e7] p-4 leading-relaxed text-black/70 ${SMALL}`}>
              <strong className="font-medium text-black">For research use only.</strong> Not approved
              for human consumption, food, veterinary, or drug use. By purchasing you confirm you are
              a qualified researcher.
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Peptide Profile ── */}
      {detail?.profile && detail.profile.length > 0 && (
        <section className={`${NARROW} pt-[clamp(4rem,9vw,10.5rem)]`}>
          <SectionHead eyebrow="Compound data" title="Peptide Profile" />
          <motion.div
            {...rise}
            className={`mx-auto mt-[clamp(2rem,4vw,4.5rem)] max-w-[85rem] overflow-hidden bg-white shadow-[0_10px_40px_rgba(0,0,0,.06)] ${CARD_R}`}
          >
            {detail.profile.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-[1fr_2fr] ${i > 0 ? "border-t border-black/5" : ""}`}>
                <div
                  className={`px-[clamp(1rem,1.6vw,2rem)] py-[clamp(.9rem,1.3vw,1.6rem)] ${SMALL}`}
                  style={{ background: "linear-gradient(180deg,#dfe4fb 0%,#eef0fb 100%)" }}
                >
                  {row.label}
                </div>
                <div
                  className={`px-[clamp(1rem,1.6vw,2rem)] py-[clamp(.9rem,1.3vw,1.6rem)] ${SMALL} ${row.label === "Storage" ? "text-black" : "text-black/60"}`}
                >
                  {row.value}
                </div>
              </div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ── What Is It ── */}
      {detail?.summary && (
        <section className={`${NARROW} pt-[clamp(4rem,9vw,10.5rem)]`}>
          <motion.div {...rise} className="mx-auto grid max-w-[85rem] gap-8 md:grid-cols-[1fr_2fr]">
            <div>
              <p className={`text-black/55 ${SMALL}`}>Overview</p>
              <h2 className={`${H2} mt-[0.6em]`}>About this product</h2>
            </div>
            <p className={`leading-relaxed text-black/65 ${BODY}`}>{detail.summary}</p>
          </motion.div>
        </section>
      )}

      {/* ── How it works ── */}
      {detail?.steps && detail.steps.length > 0 && (
        <section className={`${WIDE} mt-[clamp(4rem,9vw,10.5rem)]`}>
          <motion.div
            {...rise}
            className={`px-[clamp(1.25rem,4vw,5rem)] py-[clamp(2.5rem,5vw,6rem)] ${RADIUS}`}
            style={{ background: "linear-gradient(180deg,#f6f6f8 0%,#dfe4fb 55%,#b7c3f9 100%)" }}
          >
            <SectionHead eyebrow="Mechanism" title="How it works" />
            <div className="mx-auto mt-[clamp(2rem,4vw,4.5rem)] grid max-w-[80rem] items-center gap-10 md:grid-cols-2 md:gap-16">
              {detail.diagram && (
                <div className={`bg-white p-6 shadow-xl md:p-8 ${CARD_R}`}>
                  <img
                    src={detail.diagram}
                    alt={`${product.name} mechanism diagram`}
                    width={396}
                    height={480}
                    loading="lazy"
                    className="mx-auto w-full max-w-sm object-contain"
                  />
                </div>
              )}
              <ol className="space-y-8">
                {detail.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-black text-sm text-white">
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="text-[clamp(1rem,1.15vw,1.4rem)] font-normal">{s.title}</h3>
                      <p className={`mt-1.5 leading-relaxed text-black/60 ${SMALL}`}>{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            {detail.note && (
              <div className={`mx-auto mt-[clamp(2rem,4vw,4rem)] max-w-[80rem] bg-white/70 p-6 md:p-7 ${CARD_R}`}>
                <p className={`leading-relaxed text-black/65 ${SMALL}`}>
                  <strong className="font-medium text-black">Why it matters: </strong>
                  {detail.note}
                </p>
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* ── Technical & Laboratory Applications ── */}
      <section className={`${NARROW} pt-[clamp(4rem,9vw,10.5rem)]`}>
        <SectionHead
          eyebrow="Applications"
          title="Technical & Laboratory Applications"
          body="Designed for controlled laboratory research, research compounds may be evaluated across a range of analytical, biochemical, and experimental applications."
        />
        <div className="mt-[clamp(2rem,4vw,4.5rem)] grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TECHNICAL_APPLICATIONS.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -6 }}
              className={`p-[clamp(1.25rem,2vw,2.4rem)] text-center ${CARD_R}`}
              style={{ background: "linear-gradient(180deg,#f6f6f8 0%,#eceffc 100%)" }}
            >
              <a.icon className="mx-auto h-[clamp(2rem,2.6vw,3rem)] w-[clamp(2rem,2.6vw,3rem)] text-[#2b52e6]" strokeWidth={1.3} />
              <h3 className="mt-[1em] text-[clamp(1rem,1.15vw,1.4rem)] font-normal leading-snug">{a.title}</h3>
              <p className={`mt-2 leading-relaxed text-black/55 ${SMALL}`}>{a.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Usage / storage info ── */}
      {infoBlocks.length > 0 && (
        <section className={`${NARROW} pt-[clamp(2rem,4vw,4.5rem)]`}>
          <div className="mx-auto grid max-w-[85rem] gap-4">
            {infoBlocks.map((b) => (
              <motion.div
                key={b.title}
                {...rise}
                className={`p-[clamp(1.25rem,2vw,2.4rem)] ${CARD_R}`}
                style={{ background: "linear-gradient(160deg,#eceffc 0%,#f6f6f8 70%)" }}
              >
                <h3 className="text-[clamp(1rem,1.15vw,1.4rem)] font-normal">{b.title}</h3>
                <p className={`mt-2 leading-relaxed text-black/60 ${SMALL}`}>{b.body}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {detail?.faqs && detail.faqs.length > 0 && (
        <section className="mx-auto max-w-[57rem] px-4 pt-[clamp(4rem,9vw,10.5rem)] text-center">
          <SectionHead eyebrow="Everything You Need to Know" title="Frequently Asked Questions" />
          <motion.div {...rise} className="mt-[clamp(2rem,4vw,4.5rem)] border-t border-black/10 text-left">
            {detail.faqs.map((f) => (
              <FaqRow key={f.q} q={f.q} a={f.a} />
            ))}
          </motion.div>
        </section>
      )}

      {/* ── Related products ── */}
      {related.length > 0 && (
        <section className={`${NARROW} pb-[clamp(4rem,9vw,10rem)] pt-[clamp(4rem,9vw,10.5rem)]`}>
          <SectionHead eyebrow="You may also like" title="Related products" />
          <div className="mt-[clamp(2rem,4vw,4.5rem)] grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductThumb key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
      {related.length === 0 && <div className="pb-[clamp(4rem,9vw,10rem)]" />}
    </div>
  );
}
