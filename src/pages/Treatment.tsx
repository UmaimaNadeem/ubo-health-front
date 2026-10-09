import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Crosshair,
  CreditCard,
  Dumbbell,
  Heart,
  HeartPulse,
  MessageCircle,
  Minus,
  Moon,
  Pill,
  Plus,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Syringe,
  Truck,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Seo } from "../components/Seo";
import { ProductVial } from "../components/obu/Vial";
import type { BulletIcon, Callout, Treatment } from "../data/treatments";

/* Same type/layout scale as Home (measured from the 1904px reference). */
const NARROW = "mx-auto w-full max-w-[1544px] px-4 sm:px-8 min-[1700px]:px-0";
const WIDE = "mx-auto w-full max-w-[1806px] px-4 sm:px-6 min-[1700px]:px-0";
const H2 = "font-heading font-normal leading-[1.2] text-[clamp(1.6rem,2.3vw,2.75rem)]";
const BODY = "text-[clamp(.85rem,.9vw,1.1rem)]";
const SMALL = "text-[clamp(.75rem,.75vw,.9rem)]";
const RADIUS = "rounded-[clamp(1.75rem,2.5vw,3rem)]";
const CARD_R = "rounded-[clamp(1.25rem,1.6vw,1.9rem)]";
const EASE = [0.22, 1, 0.36, 1] as const;
const QUALIFY = "/contact";

const rise = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: EASE },
} as const;

const BULLET_ICONS: Record<BulletIcon, LucideIcon> = {
  price: CircleDollarSign,
  shipping: Truck,
  care: HeartPulse,
  cancel: CreditCard,
  target: Crosshair,
  trial: CalendarDays,
  energy: Zap,
  moon: Moon,
  syringe: Syringe,
  direct: Pill,
};
const DEFAULT_ICONS: BulletIcon[] = ["energy", "moon", "care", "syringe"];

const THEME = {
  gold: {
    cta: "#a67c45",
    ctaHover: "#8c6636",
    card: "linear-gradient(180deg,#f4f0ea 0%,#e5d8c6 100%)",
    plan: "linear-gradient(160deg,#e9dfd1 0%,#f6f2ec 70%)",
    banner: "linear-gradient(180deg,#f6f3ef 0%,#eadfd0 45%,#c4a074 100%)",
    soft: "linear-gradient(180deg,#f4f4f4 0%,#f5dcb8 100%)",
    stat: "linear-gradient(180deg,#ece8e2 0%,#dcd7d0 100%)",
    planFeatured: "linear-gradient(200deg,#e2cfae 0%,#faf7f2 70%)",
    ctaBg: "linear-gradient(110deg,#f7efe3 0%,#f1e1c8 55%,#e9d2ae 100%)",
    cmpHead: "linear-gradient(180deg,#d9c3a2 0%,#efe5d6 100%)",
    cmpRow: "linear-gradient(180deg,#e6d7bf 0%,#f1e9dc 100%)",
    cmpOwnHead: "#f3ece1",
    cmpOwn: "#f9f5ee",
    cmpOther: "linear-gradient(135deg,#f6e9d6 0%,#fdf8f0 100%)",
    line: "#a67c45",
  },
  blue: {
    cta: "#2b3fd0",
    ctaHover: "#1f30a8",
    card: "linear-gradient(180deg,#eff1fc 0%,#c9d2fa 100%)",
    plan: "linear-gradient(160deg,#dfe4fb 0%,#f4f5fb 70%)",
    banner: "linear-gradient(180deg,#f3f4f7 0%,#e1e5fb 28%,#a9b8f8 62%,#5878f5 100%)",
    soft: "linear-gradient(180deg,#f4f4f6 0%,#d5dcfa 100%)",
    stat: "linear-gradient(135deg,#c9d4fb 0%,#eef0f7 100%)",
    planFeatured: "linear-gradient(200deg,#8ea3f5 0%,#f7f8fd 70%)",
    ctaBg: "linear-gradient(105deg,#fdf1e2 0%,#fbe6cf 22%,#f1ece9 42%,#bfcbfa 72%,#4b67f0 100%)",
    cmpHead: "linear-gradient(135deg,#9aa9ee 0%,#cbd3f6 100%)",
    cmpRow: "linear-gradient(135deg,#aab6f1 0%,#e3e7fa 100%)",
    cmpOwnHead: "#ffffff",
    cmpOwn: "#ffffff",
    cmpOther: "linear-gradient(135deg,#dde2fa 0%,#fbf6f0 100%)",
    line: "#2b3fd0",
  },
};

/** Photo slot: shows /obu/<file> once you add it, otherwise renders `fallback` (or nothing). */
function Photo({
  file,
  alt,
  className = "",
  fallback = null,
}: {
  file: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) return <>{fallback}</>;
  return (
    <img
      src={`/obu/${file}`}
      alt={alt}
      loading="lazy"
      onError={() => setOk(false)}
      className={className}
    />
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className={`text-black/55 ${SMALL}`}>{children}</p>;
}

function PillCta({
  to,
  color,
  hover,
  children,
  block = false,
}: {
  to: string;
  color: string;
  hover?: string;
  children: React.ReactNode;
  block?: boolean;
}) {
  const [h, setH] = useState(false);
  const bg = h && hover ? hover : color;
  return (
    <Link
      to={to}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className={`group items-center gap-2 text-white transition ${block ? "flex w-full justify-between" : "inline-flex"}`}
    >
      <span
        className={`inline-flex h-10 items-center justify-center rounded-full px-6 text-[15px] md:h-11 min-[1500px]:text-[17px] ${block ? "flex-1" : ""}`}
        style={{ background: bg }}
      >
        {children}
      </span>
      <span
        className="grid h-10 w-10 place-items-center rounded-full md:h-11 md:w-11"
        style={{ background: bg }}
      >
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#3fae6a] text-white">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      <span className={BODY}>{children}</span>
    </li>
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
        className={`flex w-full items-center justify-between py-[clamp(1rem,1.5vw,1.75rem)] text-left ${BODY}`}
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

/* ---------- sections ---------- */

type GalleryItem =
  | { kind: "vial" }
  | { kind: "label" }
  | { kind: "photo"; file: string; alt: string };

function Gallery({ t }: { t: Treatment }) {
  const th = THEME[t.accent];
  const items: GalleryItem[] = [
    { kind: "vial" },
    { kind: "photo", file: `${t.slug}-2.png`, alt: `${t.name} close-up` },
    { kind: "label" },
    { kind: "photo", file: t.lifestyle ?? "couple.png", alt: "Lifestyle" },
  ];
  const [active, setActive] = useState(0);

  const render = (it: GalleryItem, big: boolean) => {
    if (it.kind === "vial")
      return (
        <ProductVial
          id={`${t.slug}-${big ? "main" : "thumb"}`}
          variant={t.vial.variant}
          label={t.vial.label}
          className={`${big ? "h-[86%]" : "h-[82%]"} w-auto drop-shadow-[0_22px_24px_rgba(0,0,0,.2)]`}
        />
      );
    if (it.kind === "label")
      return (
        <div className="h-full w-full overflow-hidden">
          <ProductVial
            id={`${t.slug}-${big ? "label-main" : "label-thumb"}`}
            variant={t.vial.variant}
            label={t.vial.label}
            className="mx-auto mt-[-70%] w-[70%]"
          />
        </div>
      );
    return (
      <Photo
        file={it.file}
        alt={it.alt}
        className="h-full w-full object-cover"
        fallback={
          <div className="grid h-full w-full place-items-center">
            <span className="h-[46%] w-[46%] rounded-full bg-white/60 shadow-inner" />
          </div>
        }
      />
    );
  };

  return (
    <div className="space-y-2 lg:sticky lg:top-28 lg:self-start">
      <div
        className={`group relative grid aspect-[645/605] place-items-center overflow-hidden ${CARD_R}`}
        style={{ background: th.card }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 grid place-items-center transition-transform duration-700 group-hover:scale-105"
          >
            {render(items[active], true)}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((it, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show image ${i + 1}`}
            aria-current={active === i}
            className={`grid aspect-[320/327] place-items-center overflow-hidden ${CARD_R} border transition ${
              active === i ? "border-[#a67c45]" : "border-transparent hover:border-black/20"
            }`}
            style={{ background: th.card }}
          >
            {render(it, false)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Hero({ t }: { t: Treatment }) {
  const th = THEME[t.accent];
  const plans = t.plans ?? [];
  const [planIdx, setPlanIdx] = useState(0);
  const chosen = plans[planIdx];
  const price = chosen && planIdx > 0 ? chosen.price : t.price;
  const per = chosen && planIdx > 0 ? `for ${chosen.months} months` : t.per;
  const icons = t.bulletIcons ?? DEFAULT_ICONS;

  return (
    <section className={`${NARROW} pt-[clamp(1rem,1.9vw,2.2rem)]`}>
      <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-black/50 ${SMALL}`}>
        <Link to="/" className="hover:text-black">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/peptides" className="hover:text-black">
          {t.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-black">{t.name}</span>
      </nav>

      <div className="mt-[clamp(1rem,1.7vw,2rem)] grid gap-[clamp(1.5rem,3.8vw,4.5rem)] lg:grid-cols-[645fr_813fr]">
        <Gallery t={t} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <h1 className={`${H2} max-w-[16em]`}>{t.headline}</h1>
          <p className={`mt-[1.4em] max-w-[40em] leading-relaxed text-black/65 ${BODY}`}>
            {t.intro}
          </p>

          <p className={`mt-[1.4em] flex items-center gap-2 text-black/60 ${SMALL}`}>
            <span className="h-2 w-2 rounded-full bg-[#3fae6a]" /> In stock
          </p>
          <p className="mt-2 font-heading text-[clamp(2rem,2.6vw,3.1rem)] font-normal leading-none">
            ${price}
            <span className={`ml-2 font-body text-black/45 ${SMALL}`}>
              {[per, t.priceNote].filter(Boolean).join(" ")}
            </span>
          </p>

          <ul className="mt-[1.6em] space-y-[0.9em]">
            {t.bullets.map((b, i) => {
              const Icon = BULLET_ICONS[icons[i % icons.length]];
              return (
                <li key={b} className={`flex items-start gap-3 ${BODY}`}>
                  <Icon
                    className="mt-[0.2em] h-[1em] w-[1em] shrink-0 text-black/70"
                    strokeWidth={1.5}
                  />
                  {b}
                </li>
              );
            })}
          </ul>

          {plans.length > 1 && (
            <div className="mt-[2em]">
              <p className={`text-black/55 ${SMALL}`}>
                <span className="text-black">Subscription:</span> {chosen.months}-month
              </p>
              <div
                className="mt-2 flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Subscription length"
              >
                {plans.map((p, i) => (
                  <button
                    key={p.months}
                    type="button"
                    role="radio"
                    aria-checked={planIdx === i}
                    onClick={() => setPlanIdx(i)}
                    className={`rounded-full border px-5 py-2 transition ${SMALL} ${
                      planIdx === i
                        ? "border-black bg-black text-white"
                        : "border-black/20 hover:border-black"
                    }`}
                  >
                    {p.months}-{p.months === 1 ? "month" : "months"}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-[2em]">
            <PillCta to={QUALIFY} color={th.cta} hover={th.ctaHover}>
              {t.ctaLabel ?? "See if I qualify"}
            </PillCta>
          </div>

          <div className={`mt-[1.8em] flex flex-wrap items-center gap-2 text-black/55 ${SMALL}`}>
            Pay later with
            {["VISA", "Mastercard", "AMEX", "Affirm"].map((c) => (
              <span
                key={c}
                className="rounded border border-black/15 px-2 py-0.5 text-[0.8em] font-semibold text-black/60"
              >
                {c}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Plans({ t }: { t: Treatment }) {
  const th = THEME[t.accent];
  const plans = t.plans;
  if (!plans || plans.length === 0) return null;
  const three = plans.length >= 3;
  return (
    <section
      className={`${NARROW} pb-[clamp(4rem,9vw,10rem)] pt-[clamp(4rem,9vw,10.5rem)] text-center`}
    >
      <motion.div {...rise}>
        <Eyebrow>{t.plansEyebrow ?? "Two ways to begin"}</Eyebrow>
        <h2 className={`${H2} mt-[0.6em]`}>Choose the plan that fits your goals</h2>
      </motion.div>
      <div
        className={`mx-auto mt-[clamp(2rem,4vw,4.5rem)] grid gap-4 text-left ${
          three
            ? "max-w-[64rem] md:grid-cols-3"
            : plans.length > 1
              ? "max-w-[85rem] md:grid-cols-2"
              : "max-w-[42rem]"
        }`}
      >
        {plans.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
            whileHover={{ y: -6 }}
            className={`relative flex flex-col p-[clamp(1.5rem,2.2vw,2.6rem)] ${CARD_R}`}
            style={{ background: p.badge ? th.planFeatured : th.plan }}
          >
            {p.badge && (
              <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black px-3 py-0.5 text-[0.7rem] font-medium text-white">
                {p.badge}
              </span>
            )}
            <p className={`text-black/50 ${SMALL}`}>{p.label}</p>
            <p className="mt-1 font-heading text-[clamp(2.2rem,3vw,3.5rem)] font-normal leading-none">
              ${p.price.toLocaleString("en-US")}
              {p.months === 1 && t.per && (
                <span className={`ml-1 font-body text-black/45 ${SMALL}`}>{t.per}</span>
              )}
            </p>
            <ul className="mt-[1.6em] flex-1 space-y-[0.9em] pt-[clamp(1rem,3vw,3.5rem)]">
              {p.bullets.map((b) => (
                <CheckItem key={b}>{b}</CheckItem>
              ))}
            </ul>
            <Link
              to={QUALIFY}
              className="group mt-8 flex h-[clamp(2.75rem,3vw,3.5rem)] items-center rounded-full bg-black pl-6 pr-1.5 text-white transition hover:bg-black/80"
            >
              <span className={`mx-auto ${BODY}`}>{p.cta}</span>
              <span className="grid h-[calc(100%-0.5rem)] aspect-square place-items-center rounded-full bg-white/15">
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function MechanismDiagram({ color }: { color: string }) {
  const nodes = [
    { x: 150, y: 90 },
    { x: 650, y: 90 },
    { x: 150, y: 340 },
    { x: 650, y: 340 },
  ];
  return (
    <svg viewBox="0 0 800 460" className="absolute inset-0 h-full w-full" aria-hidden>
      {nodes.map((n, i) => (
        <g key={i}>
          <line
            x1={400}
            y1={230}
            x2={n.x}
            y2={n.y}
            stroke="#fff"
            strokeOpacity="0.7"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          {[62, 46, 30].map((r, k) => (
            <circle
              key={r}
              cx={n.x}
              cy={n.y}
              r={r}
              fill="none"
              stroke={color}
              strokeOpacity={0.25 + k * 0.2}
              strokeWidth="1.5"
            />
          ))}
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={14}
            fill={color}
            fillOpacity="0.55"
            animate={{ r: [12, 17, 12] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      ))}
      <ellipse cx="400" cy="200" rx="92" ry="112" fill="#fff" fillOpacity="0.55" />
      <path d="M180 460c10-90 90-130 220-130s210 40 220 130z" fill="#fff" fillOpacity="0.45" />
      <motion.circle
        cx="400"
        cy="170"
        r="30"
        fill={color}
        fillOpacity="0.5"
        animate={{ r: [26, 36, 26], fillOpacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

/** Clickable pulsing hotspot. The active one is bigger and opens its callout card. */
function Hotspot({
  x,
  y,
  active,
  onClick,
  label,
  delay = 0,
}: {
  x: number;
  y: number;
  active: boolean;
  onClick: () => void;
  label: string;
  delay?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 p-2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <motion.span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[clamp(1.4rem,2.2vw,2.6rem)] w-[clamp(1.4rem,2.2vw,2.6rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45"
        animate={{
          scale: active ? [1.1, 1.7, 1.1] : [1, 1.35, 1],
          opacity: active ? [0.8, 0.2, 0.8] : [0.5, 0.15, 0.5],
        }}
        transition={{ duration: 2.8, delay, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className={`relative block rounded-full bg-white shadow-[0_0_0_3px_rgba(70,100,235,.6),0_0_14px_4px_rgba(255,255,255,.75)] transition-all ${
          active
            ? "h-[clamp(.8rem,1.1vw,1.3rem)] w-[clamp(.8rem,1.1vw,1.3rem)]"
            : "h-[clamp(.55rem,.8vw,1rem)] w-[clamp(.55rem,.8vw,1rem)] opacity-80"
        }`}
      />
    </button>
  );
}

function CalloutCard({ c }: { c: Callout }) {
  return (
    <div className="w-[clamp(13rem,18vw,20rem)] rounded-[1.4rem] border border-white/70 bg-white/25 p-[clamp(1rem,1.3vw,1.5rem)] text-left shadow-[0_8px_30px_rgba(40,60,160,.12)] backdrop-blur-md">
      <p className="font-heading text-[clamp(1rem,1.2vw,1.4rem)] leading-snug text-black/65">
        {c.title}
      </p>
      <p className="mt-2 text-[clamp(.8rem,.9vw,1.05rem)] font-medium leading-snug text-black/85">
        {c.body}
      </p>
    </div>
  );
}

/**
 * Art with clickable hotspots. The active hotspot shows a glass callout card joined to the dot by a line.
 * Cycles automatically every few seconds (paused on hover). On phones the card sits under the art.
 * `aspect` must match the art's own aspect ratio so the hotspot percentages line up.
 */
function CalloutStage({
  items,
  aspect,
  className,
  children,
}: {
  items: Callout[];
  aspect: string;
  className: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || items.length < 2) return;
    const id = setInterval(() => setActive((n) => (n + 1) % items.length), 4500);
    return () => clearInterval(id);
  }, [items.length, paused]);
  const cur = items[active];
  return (
    <div
      className="flex w-full flex-col items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={`relative ${className}`} style={{ aspectRatio: aspect }}>
        {children}
        {items.map((c, i) => (
          <Hotspot
            key={c.title}
            x={c.x}
            y={c.y}
            active={i === active}
            onClick={() => setActive(i)}
            label={c.title}
            delay={i * 0.5}
          />
        ))}
        <AnimatePresence mode="wait">
          {cur && (
            <div
              key={active}
              className="pointer-events-none absolute z-30 hidden -translate-y-1/2 md:block"
              style={
                cur.side === "left"
                  ? { right: `${100 - cur.x}%`, top: `${cur.y}%` }
                  : { left: `${cur.x}%`, top: `${cur.y}%` }
              }
            >
              <motion.div
                initial={{ opacity: 0, x: cur.side === "left" ? 14 : -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className={`flex items-center ${cur.side === "left" ? "flex-row-reverse" : "flex-row"}`}
              >
                <span className="h-px w-[clamp(2rem,7vw,8rem)] bg-white/90" />
                <CalloutCard c={cur} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
      {cur && (
        <div className="mt-4 flex justify-center md:hidden" aria-live="polite">
          <CalloutCard key={active} c={cur} />
        </div>
      )}
    </div>
  );
}

/** Translucent body figure (public/obu/body.png, inverted so it glows on the blue banner). */
function BodyArt() {
  return (
    <div
      className="absolute inset-0"
      style={{
        WebkitMaskImage: "linear-gradient(#000 78%, transparent 100%)",
        maskImage: "linear-gradient(#000 78%, transparent 100%)",
      }}
    >
      <Photo
        file="body.png"
        alt=""
        className="h-full w-full object-contain [filter:invert(1)_brightness(1.25)_drop-shadow(0_0_18px_rgba(140,170,255,.65))]"
        fallback={null}
      />
    </div>
  );
}

/** Glowing NAD+ molecule + four organelle orbs. Drop /public/obu/nad-mechanism.png in to replace it with a photo/render. */
function MoleculeArt() {
  const orbs = [
    { x: 150, y: 120, r: 78, kind: "mito" },
    { x: 650, y: 110, r: 66, kind: "dna" },
    { x: 130, y: 330, r: 62, kind: "net" },
    { x: 690, y: 320, r: 62, kind: "cell" },
    { x: 400, y: 410, r: 66, kind: "core" },
  ] as const;
  return (
    <svg
      viewBox="0 0 800 480"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="NAD+ molecule powering cell structures"
    >
      <defs>
        <radialGradient id="obu-orb" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#fff3dc" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#d9a35a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#3a2410" stopOpacity="0.95" />
        </radialGradient>
        <radialGradient id="obu-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
      </defs>
      {orbs.map((o, i) => (
        <g key={i}>
          <line
            x1={400}
            y1={235}
            x2={o.x}
            y2={o.y}
            stroke="#fff"
            strokeOpacity="0.75"
            strokeWidth="1.6"
          />
          <circle cx={(400 + o.x) / 2} cy={(235 + o.y) / 2} r="5" fill="#fff" fillOpacity="0.8" />
          <circle cx={o.x} cy={o.y} r={o.r + 18} fill="url(#obu-glow)" />
          <circle
            cx={o.x}
            cy={o.y}
            r={o.r}
            fill="url(#obu-orb)"
            stroke="#fff"
            strokeOpacity="0.5"
          />
          {o.kind === "mito" && (
            <g fill="none" stroke="#ffe6bd" strokeOpacity="0.85" strokeWidth="2">
              <path d={`M${o.x - 46} ${o.y}q12-30 24 0t24 0t24 0`} />
              <path d={`M${o.x - 46} ${o.y + 22}q12-30 24 0t24 0t24 0`} />
              <path d={`M${o.x - 46} ${o.y - 22}q12-30 24 0t24 0t24 0`} />
            </g>
          )}
          {o.kind === "dna" && (
            <g fill="none" stroke="#ffe6bd" strokeOpacity="0.9" strokeWidth="2">
              <path d={`M${o.x - 28} ${o.y - 40}c50 20-50 50 0 80`} />
              <path d={`M${o.x + 28} ${o.y - 40}c-50 20 50 50 0 80`} />
              {[-26, -8, 10, 28].map((dy) => (
                <line
                  key={dy}
                  x1={o.x - 18}
                  x2={o.x + 18}
                  y1={o.y + dy}
                  y2={o.y + dy}
                  strokeOpacity="0.6"
                />
              ))}
            </g>
          )}
          {o.kind === "net" && (
            <g stroke="#ffe6bd" strokeOpacity="0.8" strokeWidth="1.4" fill="#ffe6bd">
              {[
                [-30, -20],
                [10, -34],
                [34, 4],
                [-6, 8],
                [-34, 26],
                [18, 34],
              ].map(([dx, dy], k, a) => (
                <g key={k}>
                  <circle cx={o.x + dx} cy={o.y + dy} r="3.5" />
                  <line
                    x1={o.x + dx}
                    y1={o.y + dy}
                    x2={o.x + a[(k + 1) % a.length][0]}
                    y2={o.y + a[(k + 1) % a.length][1]}
                  />
                  <line
                    x1={o.x + dx}
                    y1={o.y + dy}
                    x2={o.x + a[(k + 3) % a.length][0]}
                    y2={o.y + a[(k + 3) % a.length][1]}
                  />
                </g>
              ))}
            </g>
          )}
          {o.kind === "cell" && (
            <g fill="none" stroke="#ffe6bd" strokeOpacity="0.85" strokeWidth="2">
              <path
                d={`M${o.x - 34} ${o.y - 6}c10-34 50-30 58-4c12 6 6 40-16 40c-10 18-44 16-46-6c-14-6-10-24 4-30z`}
              />
            </g>
          )}
          {o.kind === "core" && (
            <g fill="none" stroke="#ffe6bd" strokeOpacity="0.85" strokeWidth="2">
              <circle cx={o.x} cy={o.y} r="36" />
              <circle cx={o.x} cy={o.y} r="20" />
              <circle cx={o.x + 6} cy={o.y - 4} r="7" fill="#ffe6bd" fillOpacity="0.8" />
            </g>
          )}
        </g>
      ))}
      <motion.g
        animate={{ scale: [1, 1.03, 1] }}
        style={{ transformOrigin: "400px 235px" }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="400" cy="235" r="130" fill="url(#obu-glow)" />
        <circle
          cx="400"
          cy="235"
          r="92"
          fill="url(#obu-orb)"
          stroke="#fff"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <circle
          cx="400"
          cy="235"
          r="104"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.35"
          strokeDasharray="3 7"
        />
        <text
          x="398"
          y="252"
          textAnchor="middle"
          fontSize="54"
          fill="#fff6e6"
          fontFamily="Outfit, sans-serif"
          fontWeight="500"
        >
          NAD
          <tspan dy="-22" fontSize="30">
            +
          </tspan>
        </text>
      </motion.g>
    </svg>
  );
}

function Mechanism({ t }: { t: Treatment }) {
  const th = THEME[t.accent];
  const m = t.mechanism;
  if (!m) return null;
  const items = m.callouts ?? [];
  return (
    <section className={WIDE}>
      <motion.div
        {...rise}
        className={`relative flex flex-col items-center overflow-hidden px-4 pt-[clamp(2rem,4.5vw,5.5rem)] text-center ${RADIUS} ${
          m.kind === "body" ? "" : "pb-[clamp(1.5rem,4vw,5rem)]"
        }`}
        style={{ background: th.banner }}
      >
        <Eyebrow>{m.eyebrow}</Eyebrow>
        <h2 className={`${H2} mt-[0.6em] max-w-[14em]`}>{m.title}</h2>
        <div className="mt-[clamp(1rem,2.5vw,3rem)] w-full">
          {m.kind === "body" && (
            <CalloutStage items={items} aspect="900 / 795" className="w-[clamp(18rem,40vw,46rem)]">
              <BodyArt />
            </CalloutStage>
          )}
          {m.kind === "molecule" && (
            <CalloutStage items={items} aspect="800 / 480" className="w-full max-w-[56rem]">
              <Photo
                file="nad-mechanism.png"
                alt="How NAD+ works"
                className="absolute inset-0 h-full w-full object-contain"
                fallback={<MoleculeArt />}
              />
            </CalloutStage>
          )}
          {m.kind === "diagram" && (
            <CalloutStage items={items} aspect="800 / 460" className="w-full max-w-[56rem]">
              <Photo
                file="mechanism.png"
                alt="How it works"
                className="absolute inset-0 h-full w-full object-contain"
                fallback={<MechanismDiagram color="#a67c45" />}
              />
            </CalloutStage>
          )}
        </div>
      </motion.div>
    </section>
  );
}

function GhChart({ color }: { color: string }) {
  const ages = ["20", "30", "40", "50", "60+"];
  return (
    <svg
      viewBox="0 0 520 260"
      className="w-full"
      role="img"
      aria-label="Illustrative growth hormone decline with age"
    >
      {[40, 100, 160].map((y) => (
        <line key={y} x1="30" x2="500" y1={y} y2={y} stroke="#000" strokeOpacity="0.07" />
      ))}
      <motion.path
        d="M30 50C130 60 200 90 280 130S430 190 500 200"
        fill="none"
        stroke="#8f8a83"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: EASE }}
      />
      <motion.path
        d="M30 50C130 54 200 64 280 76S430 92 500 100"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, delay: 0.3, ease: EASE }}
      />
      <g>
        <rect x="428" y="132" width="68" height="26" rx="8" fill="#111" />
        <text
          x="462"
          y="150"
          textAnchor="middle"
          fontSize="12"
          fill="#fff"
          fontFamily="Poppins, sans-serif"
        >
          Declined
        </text>
      </g>
      {ages.map((a, i) => (
        <text
          key={a}
          x={30 + i * 117.5}
          y="245"
          textAnchor="middle"
          fontSize="12"
          fill="#000"
          fillOpacity="0.5"
          fontFamily="Poppins, sans-serif"
        >
          {a}
        </text>
      ))}
    </svg>
  );
}

/** One steadily falling curve (NAD+ level vs age) with an area fill and age markers. Illustrative only. */
function NadChart({ color }: { color: string }) {
  const f = (x: number) => 42 + 150 * Math.pow(x / 520, 0.9);
  const pts = Array.from({ length: 53 }, (_, i) => [i * 10, f(i * 10)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L520 220 L0 220Z`;
  const ages = [
    { a: "20", x: 60 },
    { a: "30", x: 190 },
    { a: "40", x: 320 },
    { a: "50", x: 450 },
  ];
  return (
    <svg
      viewBox="0 0 520 262"
      className="w-full"
      role="img"
      aria-label="Illustrative NAD+ decline with age"
    >
      <defs>
        <linearGradient id="obu-nad-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#obu-nad-area)" />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: EASE }}
      />
      {ages.map((p) => (
        <g key={p.a}>
          <line
            x1={p.x}
            x2={p.x}
            y1={f(p.x)}
            y2="220"
            stroke="#000"
            strokeOpacity="0.25"
            strokeDasharray="3 5"
          />
          <circle cx={p.x} cy={f(p.x)} r="4.5" fill="#fff" stroke={color} strokeWidth="1.5" />
          <text
            x={p.x}
            y="245"
            textAnchor="middle"
            fontSize="12"
            fill="#000"
            fillOpacity="0.5"
            fontFamily="Poppins, sans-serif"
          >
            {p.a}
          </text>
        </g>
      ))}
      <g>
        <rect x="288" y={f(320) - 46} width="64" height="26" rx="8" fill="#111" />
        <path d={`M320 ${f(320) - 16}l-5-5h10z`} fill="#111" />
        <text
          x="320"
          y={f(320) - 29}
          textAnchor="middle"
          fontSize="12"
          fill="#fff"
          fontFamily="Poppins, sans-serif"
        >
          Declining
        </text>
      </g>
    </svg>
  );
}

/** Interactive "your potential weight loss" estimate: tick gauge + starting-weight slider. Illustrative only. */
function WeightCard({ t }: { t: Treatment }) {
  const th = THEME[t.accent];
  const pct = t.chart?.pct ?? 0.15;
  const MIN = 120;
  const MAX = 400;
  const [w, setW] = useState(200);
  const loss = Math.round(w * pct);
  const frac = (w - MIN) / (MAX - MIN);
  const ticks = Array.from({ length: 15 }, (_, i) => {
    const ang = Math.PI * (1.08 + (i / 14) * 0.84); // left -> right across the top
    return { i, ang };
  });
  const active = Math.round(frac * 14);
  return (
    <motion.div
      {...rise}
      className={`flex flex-col items-center p-[clamp(1.5rem,2.6vw,3rem)] text-center ${RADIUS}`}
      style={{ background: th.stat }}
    >
      <Eyebrow>{t.chart?.eyebrow ?? "Your potential weight loss is"}</Eyebrow>
      <p
        className="mt-3 font-heading text-[clamp(3.5rem,6vw,7rem)] font-normal leading-none"
        aria-live="polite"
      >
        {loss}
        <span className="ml-1 text-[0.4em]">lbs</span>
      </p>
      <div className="relative mt-[clamp(1rem,2vw,2.5rem)] w-full max-w-[28rem]">
        <svg viewBox="0 0 400 190" className="w-full" aria-hidden>
          {ticks.map(({ i, ang }) => {
            const on = i === active;
            const r1 = on ? 138 : 150;
            const r2 = 182;
            return (
              <line
                key={i}
                x1={200 + Math.cos(ang) * r1}
                y1={190 + Math.sin(ang) * r1}
                x2={200 + Math.cos(ang) * r2}
                y2={190 + Math.sin(ang) * r2}
                stroke="#000"
                strokeOpacity={on ? 0.8 : 0.35}
                strokeWidth={on ? 2.5 : 1.5}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute left-1/2 top-[48%] -translate-x-1/2 rounded-xl bg-black px-4 py-2 text-white">
          <p className="text-[0.7rem] text-white/70">Starting Weight</p>
          <p className="font-heading text-[clamp(1.2rem,1.6vw,1.8rem)] leading-tight">
            {w}
            <span className="text-[0.6em]">lbs</span>
          </p>
        </div>
      </div>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={5}
        value={w}
        onChange={(e) => setW(Number(e.target.value))}
        aria-label="Starting weight in pounds"
        className="mt-2 w-full max-w-[22rem] cursor-pointer"
        style={{ accentColor: th.line }}
      />
      <p className="mt-4 max-w-[28em] text-[0.7rem] text-black/40">
        Illustrative estimate only, not a guarantee or clinical data. Results vary with dose,
        lifestyle and individual response.
      </p>
    </motion.div>
  );
}

/** Types `text` out one character at a time, with a blinking cursor (like the live site). */
function Typewriter({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => setN((c) => (c >= text.length ? c : c + 1)), 38);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span aria-label={text}>
      {text.slice(0, n)}
      <span
        aria-hidden
        className="ml-px inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse bg-black"
      />
    </span>
  );
}

function KitCarousel({ t }: { t: Treatment }) {
  const items = [
    { key: "doctor", file: "doctor.png", icon: Stethoscope, caption: "Support Access" },
    { key: "phone", file: "phone.png", icon: Smartphone, caption: "Online visit & care app" },
    { key: "vial", file: null, icon: null, caption: t.kitCaption ?? `Compounded ${t.name}` },
    { key: "syringe", file: "syringe.png", icon: Syringe, caption: "Supplies included" },
  ];
  const [i, setI] = useState(2);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % items.length), 3600);
    return () => clearInterval(id);
  }, [items.length]);
  // five visible slots around the active item (wraps around, so the row looks endless)
  const slots = [-2, -1, 0, 1, 2].map((off) => ({
    off,
    idx: (((i + off) % items.length) + items.length) % items.length,
  }));
  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-[clamp(.4rem,1.2vw,1.5rem)]">
        {slots.map(({ off, idx }) => {
          const it = items[idx];
          const on = off === 0;
          return (
            <motion.button
              key={off}
              type="button"
              onClick={() => setI(idx)}
              aria-label={it.caption}
              animate={{
                scale: on ? 1.12 : 0.88,
                opacity: on ? 1 : Math.abs(off) === 1 ? 0.6 : 0.35,
              }}
              transition={{ duration: 0.6, ease: EASE }}
              className={`grid aspect-[3/4] w-[clamp(3.2rem,6.2vw,8rem)] shrink-0 place-items-center overflow-hidden rounded-[clamp(.8rem,1.2vw,1.5rem)] border border-white/60 ${
                on ? "bg-white/80 shadow-lg" : "bg-white/40 blur-[1.5px]"
              }`}
            >
              {it.key === "vial" ? (
                <ProductVial
                  id={`kit-${t.slug}-${off}`}
                  variant={t.vial.variant}
                  label={t.vial.label}
                  className="h-[82%] w-auto"
                />
              ) : (
                <Photo
                  file={it.file!}
                  alt=""
                  className="h-full w-full object-cover object-top"
                  fallback={
                    it.icon ? (
                      <it.icon className="h-[40%] w-[40%] text-black/60" strokeWidth={1.2} />
                    ) : null
                  }
                />
              )}
            </motion.button>
          );
        })}
      </div>
      <p className="mt-[clamp(1.5rem,3vw,3.5rem)] min-h-[1.5em] text-center text-[clamp(.9rem,1vw,1.2rem)] text-black">
        <Typewriter text={items[i].caption} />
      </p>
    </div>
  );
}

function InfoCards({ t }: { t: Treatment }) {
  const th = THEME[t.accent];
  const c = t.chart;
  if (!c) return null;
  return (
    <div className={`${WIDE} mt-4 grid gap-4 lg:grid-cols-2`}>
      {c.kind === "weight" ? (
        <WeightCard t={t} />
      ) : (
        <motion.div
          {...rise}
          className={`flex flex-col p-[clamp(1.5rem,2.6vw,3rem)] ${RADIUS}`}
          style={{ background: th.stat }}
        >
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h3 className="mt-2 max-w-[16em] font-heading text-[clamp(1.25rem,1.5vw,1.8rem)] font-normal leading-snug">
            {c.title}
          </h3>
          <div className="mt-6 flex-1">
            {c.kind === "nad" ? <NadChart color={th.line} /> : <GhChart color={th.line} />}
          </div>
          {c.kind === "gh" && (
            <div className={`mt-2 flex items-center gap-6 text-black/60 ${SMALL}`}>
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-5" style={{ background: th.line }} /> With {t.name}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-5 bg-[#8f8a83]" /> Natural decline
              </span>
            </div>
          )}
          <p className="mt-3 text-[0.7rem] text-black/40">
            {c.kind === "nad" ? "Age in years. " : ""}Illustrative only, not clinical data.
            Individual results vary.
          </p>
        </motion.div>
      )}

      <motion.div
        {...rise}
        className={`flex flex-col p-[clamp(1.5rem,2.6vw,3rem)] ${RADIUS}`}
        style={{ background: th.soft }}
      >
        <Eyebrow>No surprises in the box</Eyebrow>
        <h3 className="mt-2 max-w-[16em] font-heading text-[clamp(1.25rem,1.5vw,1.8rem)] font-normal leading-snug">
          Everything you need to start — and to keep going
        </h3>
        <div className="flex flex-1 items-center justify-center py-8">
          <KitCarousel t={t} />
        </div>
      </motion.div>
    </div>
  );
}

const STEPS = [
  {
    title: "Take a Quick Health Assessment",
    body: "A short online questionnaire helps determine the right treatment for you.",
  },
  {
    title: "Doctor Review & Approval",
    body: "Licensed physicians review your profile and prescribe treatment if eligible.",
  },
  {
    title: "Fast, Discreet Delivery",
    body: "Your medication is shipped directly to your door with ongoing support.",
  },
];

/** Step 1 art: a little checklist card, last row ticked. */
function ChecklistArt() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-[7%] px-[11%]">
      {[0, 1, 2].map((r) => (
        <div key={r} className="flex items-center gap-[6%]">
          <span
            className={`grid aspect-square w-[22%] shrink-0 place-items-center rounded-[28%] ${r === 2 ? "bg-black text-white" : "bg-white shadow-sm"}`}
          >
            {r === 2 && <Check className="h-[60%] w-[60%]" strokeWidth={3} />}
          </span>
          <span className="flex flex-1 flex-col gap-[14%]">
            <span className="h-[6px] w-full rounded-full bg-white" />
            <span className="h-[6px] w-4/5 rounded-full bg-white" />
          </span>
        </div>
      ))}
    </div>
  );
}

function Steps() {
  const tile =
    "relative aspect-[1.05] w-[clamp(9rem,13vw,16rem)] rounded-[clamp(1.25rem,1.6vw,1.9rem)]";
  return (
    <section
      className={`${NARROW} pb-[clamp(4rem,9vw,10rem)] pt-[clamp(4rem,8vw,9.5rem)] text-center`}
    >
      <motion.div {...rise}>
        <p className={`text-black ${SMALL}`}>Simple, Private, Fully Online</p>
        <h2 className={`${H2} mt-[0.8em]`}>Get started in 3 simple steps</h2>
      </motion.div>
      <div className="mx-auto mt-[clamp(2.5rem,5vw,6rem)] grid max-w-[80rem] gap-12 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.15 }}
            className="flex flex-col items-center"
          >
            {i === 0 && (
              <div className={`${tile} bg-gradient-to-br from-[#f1f1f1] to-[#f8eee2]`}>
                <ChecklistArt />
              </div>
            )}
            {i === 1 && (
              <div className={`${tile} bg-gradient-to-br from-[#e4f3f6] to-[#f3f8fa]`}>
                <Photo
                  file="doctor.png"
                  alt="Licensed doctor"
                  className="absolute inset-x-0 bottom-0 mx-auto h-[118%] w-auto max-w-none object-contain object-bottom"
                  fallback={
                    <span className="grid h-full w-full place-items-center">
                      <Stethoscope className="h-[34%] w-[34%] text-black/80" strokeWidth={1.2} />
                    </span>
                  }
                />
              </div>
            )}
            {i === 2 && (
              <div
                className={`${tile} grid place-items-center bg-gradient-to-br from-[#f1f1f1] to-[#e3e6fb]`}
              >
                <Zap className="h-[34%] w-[34%] text-black" fill="currentColor" strokeWidth={0} />
              </div>
            )}
            <h3 className="mt-[1.4em] max-w-[11em] font-heading text-[clamp(1.35rem,1.9vw,2.3rem)] font-normal leading-[1.15]">
              {s.title}
            </h3>
            <p className={`mt-3 max-w-[18em] leading-snug text-black ${BODY}`}>{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Cell({ v }: { v: string | boolean | null }) {
  if (v === true)
    return <Check className="mx-auto h-[1.1em] w-[1.1em] text-black/60" strokeWidth={1.5} />;
  if (v === false)
    return <X className="mx-auto h-[1.1em] w-[1.1em] text-black/45" strokeWidth={1.5} />;
  if (v === null) return <Minus className="mx-auto h-[1.1em] w-[1.1em] text-black/35" />;
  return <span>{v}</span>;
}

function Compare({ t }: { t: Treatment }) {
  if (!t.compare) return null;
  const c = t.compare;
  const th = THEME[t.accent];
  const cols = `minmax(0,1.9fr) repeat(${c.brands.length}, minmax(0,1fr))`;
  return (
    <section className={`${NARROW} pb-[clamp(4rem,9vw,10rem)] text-center`}>
      <motion.div {...rise}>
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h2 className={`${H2} mt-[0.6em]`}>{c.title}</h2>
      </motion.div>
      <motion.div {...rise} className="mt-[clamp(2rem,4vw,4.5rem)] overflow-x-auto">
        <div
          className={`mx-auto min-w-[44rem] max-w-[1370px] overflow-hidden bg-white shadow-[0_10px_40px_rgba(0,0,0,.06)] ${CARD_R}`}
        >
          <div className="grid" style={{ gridTemplateColumns: cols }}>
            <div style={{ background: th.cmpHead }} />
            {c.brands.map((b, i) => (
              <div
                key={b}
                className={`py-[clamp(1rem,1.6vw,2rem)] font-heading ${BODY} ${i === 0 ? "font-semibold" : "font-normal"}`}
                style={{ background: i === 0 ? th.cmpOwnHead : th.cmpOther }}
              >
                {b}
              </div>
            ))}
            {c.rows.map((r) => (
              <div key={r.label} className="contents">
                <div
                  className={`px-[clamp(1rem,1.6vw,2rem)] py-[clamp(.9rem,1.3vw,1.6rem)] text-left ${SMALL}`}
                  style={{ background: th.cmpRow }}
                >
                  {r.label}
                </div>
                {r.values.map((v, vi) => (
                  <div
                    key={vi}
                    className={`grid place-items-center border-t border-black/10 py-[clamp(.9rem,1.3vw,1.6rem)] ${SMALL}`}
                    style={{ background: vi === 0 ? th.cmpOwn : th.cmpOther }}
                  >
                    <Cell v={v} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Faqs({ t }: { t: Treatment }) {
  return (
    <section className="mx-auto max-w-[57rem] px-4 pb-[clamp(4rem,9vw,10rem)] text-center">
      <motion.div {...rise}>
        <Eyebrow>Everything You Need to Know</Eyebrow>
        <h2 className={`${H2} mt-[0.8em]`}>Frequently Asked Questions</h2>
      </motion.div>
      <motion.div
        {...rise}
        className="mt-[clamp(2rem,4vw,4.5rem)] border-t border-black/10 text-left"
      >
        {t.faqs.map((f) => (
          <FaqRow key={f.q} {...f} />
        ))}
      </motion.div>
    </section>
  );
}

function FinalCta({ t }: { t: Treatment }) {
  const th = THEME[t.accent];
  return (
    <section className={`${WIDE} pb-[clamp(4rem,9vw,10rem)]`}>
      <motion.div
        {...rise}
        className={`relative grid min-h-[22rem] overflow-hidden md:aspect-[3.1] md:min-h-0 md:grid-cols-2 ${RADIUS}`}
        style={{ background: th.ctaBg }}
      >
        <div className="relative z-10 flex flex-col justify-center p-6 md:py-0 md:pl-[6.4%]">
          <Eyebrow>{t.cta.eyebrow}</Eyebrow>
          <h2 className={`${H2} mt-[0.6em] max-w-[11em]`}>{t.cta.title}</h2>
          <p className={`mt-[1em] text-black/60 ${SMALL}`}>{t.cta.sub}</p>
          <ul className="mt-[1.4em] space-y-[0.7em]">
            {t.cta.bullets.map((b) => (
              <CheckItem key={b}>{b}</CheckItem>
            ))}
          </ul>
          <div className="mt-6">
            <PillCta to={QUALIFY} color="#2b52e6" hover="#1f3fc0">
              {t.cta.label ?? "See if I qualify"}
            </PillCta>
          </div>
        </div>
        <div className="relative flex items-end justify-center md:justify-end">
          <Photo
            file={t.ctaPhoto ?? "man.png"}
            alt=""
            className="relative z-10 h-[20rem] w-auto object-contain object-bottom md:h-[104%]"
            fallback={
              t.ctaPhoto && t.ctaPhoto !== "man.png" ? (
                <Photo
                  file="man.png"
                  alt=""
                  className="relative z-10 h-[20rem] w-auto object-contain object-bottom md:h-[104%]"
                />
              ) : null
            }
          />
        </div>
      </motion.div>
      <ul className={`mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-black/50 ${SMALL}`}>
        {[
          { icon: ShieldCheck, t: "Licensed U.S. providers" },
          { icon: Truck, t: "Discreet shipping" },
          { icon: Heart, t: "Ongoing support" },
          { icon: Dumbbell, t: "Personalized plans" },
        ].map((x) => (
          <li key={x.t} className="flex items-center gap-2">
            <x.icon className="h-4 w-4" strokeWidth={1.4} />
            {x.t}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- page ---------- */

export default function TreatmentPage({ treatment }: { treatment: Treatment }) {
  const t = treatment;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [t.slug]);

  return (
    <div className="overflow-x-clip bg-white font-body text-black">
      <Seo title={`${t.name} | OBU Health`} description={`${t.headline} ${t.intro}`} />
      <Hero t={t} />
      <Plans t={t} />
      <Mechanism t={t} />
      <InfoCards t={t} />
      <Steps />
      <Compare t={t} />
      <Faqs t={t} />
      <FinalCta t={t} />
    </div>
  );
}
