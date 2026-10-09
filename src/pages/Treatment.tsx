import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Heart,
  MessageCircle,
  Minus,
  Moon,
  Plus,
  Smartphone,
  Stethoscope,
  Syringe,
  Truck,
  X,
  Zap,
  ClipboardCheck,
  Dumbbell,
  ShieldCheck,
} from "lucide-react";
import { Seo } from "../components/Seo";
import { ProductVial } from "../components/obu/Vial";
import type { Treatment } from "../data/treatments";

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

const THEME = {
  gold: {
    cta: "#a67c45",
    ctaHover: "#8c6636",
    card: "linear-gradient(180deg,#f4f0ea 0%,#e5d8c6 100%)",
    plan: "linear-gradient(160deg,#e9dfd1 0%,#f6f2ec 70%)",
    banner: "linear-gradient(180deg,#f6f3ef 0%,#eadfd0 45%,#c4a074 100%)",
    soft: "linear-gradient(180deg,#f4f4f4 0%,#f5dcb8 100%)",
    line: "#a67c45",
  },
  blue: {
    cta: "#2b3fd0",
    ctaHover: "#1f30a8",
    card: "linear-gradient(180deg,#eff1fc 0%,#c9d2fa 100%)",
    plan: "linear-gradient(160deg,#dfe4fb 0%,#f4f5fb 70%)",
    banner: "linear-gradient(180deg,#f4f5fb 0%,#dde2fa 45%,#9fb0f6 100%)",
    soft: "linear-gradient(180deg,#f4f4f6 0%,#d5dcfa 100%)",
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
  return <img src={`/obu/${file}`} alt={alt} loading="lazy" onError={() => setOk(false)} className={className} />;
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
      <span className="grid h-10 w-10 place-items-center rounded-full md:h-11 md:w-11" style={{ background: bg }}>
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

type GalleryItem = { kind: "vial" } | { kind: "label" } | { kind: "photo"; file: string; alt: string };

function Gallery({ t }: { t: Treatment }) {
  const th = THEME[t.accent];
  const items: GalleryItem[] = [
    { kind: "vial" },
    { kind: "photo", file: `${t.slug}-2.png`, alt: `${t.name} close-up` },
    { kind: "label" },
    { kind: "photo", file: "couple.png", alt: "Lifestyle" },
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
            className="grid h-full w-full place-items-center transition-transform duration-700 group-hover:scale-105"
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
  const [plan, setPlan] = useState<1 | 3>(1);
  const price = plan === 3 && t.price3 ? t.price3 : t.price;
  const per = plan === 3 && t.price3 ? "for 3 months" : t.per;
  const icons = [Zap, Moon, Stethoscope, Syringe];

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
          <p className={`mt-[1.4em] max-w-[40em] leading-relaxed text-black/65 ${BODY}`}>{t.intro}</p>

          <p className={`mt-[1.4em] flex items-center gap-2 text-black/60 ${SMALL}`}>
            <span className="h-2 w-2 rounded-full bg-[#3fae6a]" /> In stock
          </p>
          <p className="mt-2 font-heading text-[clamp(2rem,2.6vw,3.1rem)] font-normal leading-none">
            ${price}
            <span className={`ml-2 font-body text-black/45 ${SMALL}`}>{per}</span>
          </p>

          <ul className="mt-[1.6em] space-y-[0.9em]">
            {t.bullets.map((b, i) => {
              const Icon = icons[i % icons.length];
              return (
                <li key={b} className={`flex items-start gap-3 ${BODY}`}>
                  <Icon className="mt-[0.2em] h-[1em] w-[1em] shrink-0 text-black/70" strokeWidth={1.5} />
                  {b}
                </li>
              );
            })}
          </ul>

          {t.price3 && (
            <div className="mt-[2em]">
              <p className={`text-black/55 ${SMALL}`}>Subscription</p>
              <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Subscription length">
                {([1, 3] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={plan === m}
                    onClick={() => setPlan(m)}
                    className={`rounded-full border px-5 py-2 transition ${SMALL} ${
                      plan === m ? "border-black bg-black text-white" : "border-black/20 hover:border-black"
                    }`}
                  >
                    {m} {m === 1 ? "month" : "months"}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-[2em]">
            <PillCta to={QUALIFY} color={th.cta} hover={th.ctaHover}>
              See if I qualify
            </PillCta>
          </div>

          <div className={`mt-[1.8em] flex flex-wrap items-center gap-2 text-black/55 ${SMALL}`}>
            Pay later with
            {["VISA", "Mastercard", "AMEX", "Affirm"].map((c) => (
              <span key={c} className="rounded border border-black/15 px-2 py-0.5 text-[0.8em] font-semibold text-black/60">
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
  const plans = [
    { label: "Monthly Plan", price: t.price, per: t.per || "", bullets: t.planBullets, cta: "Choose Monthly" },
    ...(t.price3 && t.plan3Bullets
      ? [{ label: "3-month", price: t.price3, per: "", bullets: t.plan3Bullets, cta: "Choose 3-month" }]
      : []),
  ];
  return (
    <section className={`${NARROW} pb-[clamp(4rem,9vw,10rem)] pt-[clamp(4rem,9vw,10.5rem)] text-center`}>
      <motion.div {...rise}>
        <Eyebrow>Two ways to begin</Eyebrow>
        <h2 className={`${H2} mt-[0.6em]`}>Choose the plan that fits your goals</h2>
      </motion.div>
      <div
        className={`mx-auto mt-[clamp(2rem,4vw,4.5rem)] grid max-w-[85rem] gap-4 text-left ${plans.length > 1 ? "md:grid-cols-2" : "max-w-[42rem]"}`}
      >
        {plans.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
            whileHover={{ y: -6 }}
            className={`flex flex-col p-[clamp(1.5rem,2.6vw,3rem)] ${CARD_R}`}
            style={{ background: th.plan }}
          >
            <p className={`text-black/50 ${SMALL}`}>{p.label}</p>
            <p className="mt-1 font-heading text-[clamp(2.2rem,3vw,3.5rem)] font-normal leading-none">
              ${p.price}
              {p.per && <span className={`ml-1 font-body text-black/45 ${SMALL}`}>{p.per}</span>}
            </p>
            <ul className="mt-[1.6em] flex-1 space-y-[0.9em]">
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
    <svg viewBox="0 0 800 460" className="mx-auto h-full w-full" aria-hidden>
      {nodes.map((n, i) => (
        <g key={i}>
          <line x1={400} y1={230} x2={n.x} y2={n.y} stroke="#fff" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="4 6" />
          {[62, 46, 30].map((r, k) => (
            <circle key={r} cx={n.x} cy={n.y} r={r} fill="none" stroke={color} strokeOpacity={0.25 + k * 0.2} strokeWidth="1.5" />
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

function Mechanism({ t }: { t: Treatment }) {
  const th = THEME[t.accent];
  if (!t.mechanism) return null;
  return (
    <section className={WIDE}>
      <motion.div
        {...rise}
        className={`relative flex min-h-[32rem] flex-col items-center overflow-hidden px-4 pt-[clamp(2rem,4.5vw,5.5rem)] text-center md:aspect-[1.77] md:min-h-0 ${RADIUS}`}
        style={{ background: th.banner }}
      >
        <Eyebrow>{t.mechanism.eyebrow}</Eyebrow>
        <h2 className={`${H2} mt-[0.6em] max-w-[14em]`}>{t.mechanism.title}</h2>
        <div className="relative mt-4 w-full max-w-[56rem] flex-1">
          <Photo
            file="mechanism.png"
            alt="How it works"
            className="mx-auto h-full w-auto object-contain"
            fallback={<MechanismDiagram color="#a67c45" />}
          />
        </div>
      </motion.div>
    </section>
  );
}

function GhChart({ color }: { color: string }) {
  const ages = ["20", "30", "40", "50", "60+"];
  return (
    <svg viewBox="0 0 520 260" className="w-full" role="img" aria-label="Illustrative growth hormone decline with age">
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
        <text x="462" y="150" textAnchor="middle" fontSize="12" fill="#fff" fontFamily="Poppins, sans-serif">
          Declined
        </text>
      </g>
      {ages.map((a, i) => (
        <text key={a} x={30 + i * 117.5} y="245" textAnchor="middle" fontSize="12" fill="#000" fillOpacity="0.5" fontFamily="Poppins, sans-serif">
          {a}
        </text>
      ))}
    </svg>
  );
}

function KitCarousel({ t }: { t: Treatment }) {
  const items = [
    { icon: Smartphone, label: "Online visit" },
    { icon: null, label: "Your treatment" },
    { icon: Syringe, label: "Supplies" },
    { icon: Stethoscope, label: "Your provider" },
    { icon: MessageCircle, label: "Ongoing care" },
  ];
  const [i, setI] = useState(2);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % items.length), 2600);
    return () => clearInterval(id);
  }, [items.length]);
  return (
    <div>
      <div className="flex items-center justify-center gap-[clamp(.5rem,1.2vw,1.5rem)]">
        {items.map((it, k) => {
          const on = k === i;
          return (
            <motion.button
              key={it.label}
              type="button"
              onClick={() => setI(k)}
              aria-label={it.label}
              animate={{ scale: on ? 1.15 : 0.85, opacity: on ? 1 : 0.55 }}
              transition={{ duration: 0.5, ease: EASE }}
              className={`grid aspect-[3/4] w-[clamp(3rem,5vw,6.2rem)] place-items-center overflow-hidden rounded-2xl ${on ? "bg-white shadow-lg" : "bg-white/70"}`}
            >
              {it.icon ? (
                <it.icon className="h-[40%] w-[40%] text-black/70" strokeWidth={1.3} />
              ) : (
                <ProductVial id={`kit-${t.slug}-${k}`} variant={t.vial.variant} label={t.vial.label} className="h-[80%] w-auto" />
              )}
            </motion.button>
          );
        })}
      </div>
      <p className={`mt-4 text-center text-black/60 ${SMALL}`}>{items[i].label}</p>
    </div>
  );
}

function InfoCards({ t }: { t: Treatment }) {
  const th = THEME[t.accent];
  if (!t.chart) return null;
  return (
    <div className={`${WIDE} mt-4 grid gap-4 lg:grid-cols-2`}>
      <motion.div
        {...rise}
        className={`flex flex-col p-[clamp(1.5rem,2.6vw,3rem)] ${RADIUS}`}
        style={{ background: "linear-gradient(180deg,#ece8e2 0%,#dcd7d0 100%)" }}
      >
        <Eyebrow>{t.chart.eyebrow}</Eyebrow>
        <h3 className="mt-2 max-w-[16em] font-heading text-[clamp(1.25rem,1.5vw,1.8rem)] font-normal leading-snug">
          {t.chart.title}
        </h3>
        <div className="mt-6 flex-1">
          <GhChart color={th.line} />
        </div>
        <div className={`mt-2 flex items-center gap-6 text-black/60 ${SMALL}`}>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-5" style={{ background: th.line }} /> With {t.name}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-[#8f8a83]" /> Natural decline
          </span>
        </div>
        <p className="mt-3 text-[0.7rem] text-black/40">Illustrative only, not clinical data. Individual results vary.</p>
      </motion.div>

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
  { icon: ClipboardCheck, title: "Take a Quick Health Assessment", body: "A short online questionnaire helps determine the right treatment for you." },
  { icon: Stethoscope, title: "Doctor Review & Approval", body: "Licensed physicians review your profile and prescribe treatment if eligible." },
  { icon: Zap, title: "Fast, Discreet Delivery", body: "Your medication is shipped directly to your door with ongoing support." },
];

function Steps() {
  return (
    <section className={`${NARROW} pb-[clamp(4rem,9vw,10rem)] pt-[clamp(4rem,8vw,9.5rem)] text-center`}>
      <motion.div {...rise}>
        <Eyebrow>Simple, Private, Fully Online</Eyebrow>
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
            <div className="grid aspect-[10/7] w-[clamp(7.5rem,10.5vw,12.5rem)] place-items-center rounded-[clamp(1.25rem,1.6vw,1.9rem)] bg-gradient-to-br from-[#eceefa] to-[#f6f1ea]">
              <s.icon className="h-[28%] w-[28%] text-black/80" strokeWidth={1.2} />
            </div>
            <h3 className="mt-[1.6em] max-w-[12em] text-[clamp(1rem,1.15vw,1.4rem)] font-normal leading-snug">{s.title}</h3>
            <p className={`mt-2 max-w-[17em] leading-relaxed text-black/55 ${SMALL}`}>{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Cell({ v }: { v: string | boolean | null }) {
  if (v === true) return <Check className="mx-auto h-[1.1em] w-[1.1em] text-black/60" strokeWidth={1.5} />;
  if (v === false) return <X className="mx-auto h-[1.1em] w-[1.1em] text-black/45" strokeWidth={1.5} />;
  if (v === null) return <Minus className="mx-auto h-[1.1em] w-[1.1em] text-black/35" />;
  return <span>{v}</span>;
}

function Compare({ t }: { t: Treatment }) {
  if (!t.compare) return null;
  const c = t.compare;
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
          <div className="grid grid-cols-[1.9fr_1fr_1fr_1fr_1fr]">
            <div style={{ background: "linear-gradient(180deg,#d9c3a2 0%,#efe5d6 100%)" }} />
            {c.brands.map((b, i) => (
              <div
                key={b}
                className={`py-[clamp(1rem,1.6vw,2rem)] font-heading ${BODY} ${i === 0 ? "bg-[#f3ece1] font-semibold" : "font-normal"}`}
              >
                {b}
              </div>
            ))}
            {c.rows.map((r, ri) => (
              <div key={r.label} className="contents">
                <div
                  className={`px-[clamp(1rem,1.6vw,2rem)] py-[clamp(.9rem,1.3vw,1.6rem)] text-left ${SMALL} ${ri % 2 === 0 ? "" : ""}`}
                  style={{ background: "linear-gradient(180deg,#e6d7bf 0%,#f1e9dc 100%)" }}
                >
                  {r.label}
                </div>
                {r.values.map((v, vi) => (
                  <div
                    key={vi}
                    className={`grid place-items-center border-t border-black/5 py-[clamp(.9rem,1.3vw,1.6rem)] ${SMALL} ${vi === 0 ? "bg-[#f9f5ee]" : ""}`}
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
      <motion.div {...rise} className="mt-[clamp(2rem,4vw,4.5rem)] border-t border-black/10 text-left">
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
        style={{ background: "linear-gradient(110deg,#f7efe3 0%,#f1e1c8 55%,#e9d2ae 100%)" }}
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
              See if I qualify
            </PillCta>
          </div>
        </div>
        <div className="relative flex items-end justify-center md:justify-end">
          <Photo file="man.png" alt="" className="relative z-10 h-[20rem] w-auto object-contain object-bottom md:h-[104%]" />
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
      <Seo
        title={`${t.name} | OBU Health`}
        description={`${t.headline} ${t.intro}`}
      />
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
