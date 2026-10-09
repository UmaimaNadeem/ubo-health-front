import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  ClipboardCheck,
  Eye,
  HeartPulse,
  Laptop,
  Minus,
  Pill,
  Plus,
  Star,
  Stethoscope,
  Zap,
} from "lucide-react";
import { Seo } from "../components/Seo";
import { ProductVial } from "../components/obu/Vial";

/* ------------------------------------------------------------------ */
/* Layout + type scale, measured from the 1904px-wide reference.       */
/* 1vw = 19.04px there, so clamp(min, Nvw, max) reproduces it exactly   */
/* at desktop and scales down smoothly on smaller screens.             */
/* ------------------------------------------------------------------ */

const NARROW = "mx-auto w-full max-w-[1544px] px-4 sm:px-8 min-[1700px]:px-0"; // x: 180 -> 1724
const WIDE = "mx-auto w-full max-w-[1806px] px-4 sm:px-6 min-[1700px]:px-0"; // x: 49 -> 1853

const H1 = "font-heading font-normal leading-[1.15] text-[clamp(2rem,2.95vw,3.5rem)]"; // 56px
const H2 = "font-heading font-normal leading-[1.2] text-[clamp(1.6rem,2.3vw,2.75rem)]"; // 44px
const STATEMENT = "font-heading font-normal leading-[1.5] text-[clamp(1.4rem,2.1vw,2.5rem)]"; // 40px
const BODY = "text-[clamp(.85rem,.9vw,1.1rem)]"; // 17px
const SMALL = "text-[clamp(.75rem,.75vw,.9rem)]"; // 14px
const RADIUS = "rounded-[clamp(1.75rem,2.5vw,3rem)]"; // 48px
const PAD = "p-[clamp(1.25rem,1.7vw,2rem)]"; // 32px
const EASE = [0.22, 1, 0.36, 1] as const;
const VIAL_EASE = "ease-[cubic-bezier(.22,1,.36,1)]";

/* ---------- content ---------- */

const START = "/peptides";

type Product = {
  id: string;
  name: string;
  desc: string;
  price: number;
  per: string;
  variant: "blue" | "gold";
  label: string;
};

const PRODUCTS: Product[] = [
  {
    id: "semaglutide",
    name: "Semaglutide GLP-1",
    desc: "Clinically backed GLP-1 for appetite control and sustainable weight loss",
    price: 190,
    per: "/mo",
    variant: "blue",
    label: "SEMAGLUTIDE GLP-1",
  },
  {
    id: "tirzepatide",
    name: "Tirzepatide",
    desc: "Dual-action GLP-1/GIP for enhanced weight loss and metabolic balance",
    price: 239,
    per: "/mo",
    variant: "blue",
    label: "TIRZEPATIDE GLP-1/GIP",
  },
  {
    id: "nad-injection",
    name: "NAD+ Injection",
    desc: "Wellness treatment supporting energy, mental clarity, and cellular health",
    price: 219,
    per: "",
    variant: "gold",
    label: "NAD+",
  },
  {
    id: "sermorelin",
    name: "Sermorelin",
    desc: "Peptide therapy for growth hormone, recovery, and healthy aging",
    price: 149,
    per: "/mo",
    variant: "gold",
    label: "SERMORELIN",
  },
];

const CATEGORIES = [
  {
    title: "Weight Loss",
    sub: "Semaglutide GLP-1 Tirzepatide",
    bg: "linear-gradient(180deg,#f0f0f2 0%,#c9d1fb 45%,#8ea1fa 100%)",
    vial: PRODUCTS[0],
  },
  {
    title: "Longevity",
    sub: "NAD+ Injection",
    bg: "linear-gradient(180deg,#f4f3f2 0%,#f6e4cd 45%,#f1c995 100%)",
    vial: PRODUCTS[2],
  },
  {
    title: "Muscle Support",
    sub: "Sermorelin",
    bg: "linear-gradient(180deg,#f4f3f2 0%,#f1e8dc 45%,#ead7b9 100%)",
    vial: PRODUCTS[3],
  },
];

const PRESS = ["FOX", "WSJ", "yahoo!news", "Forbes", "Forbes", "FOX", "WSJ"];
const PROMISES = [
  { icon: HeartPulse, text: "Real providers. Real care." },
  { icon: Pill, text: "Prescribed, not guessed." },
  { icon: ClipboardCheck, text: "Personalized treatment." },
  { icon: Laptop, text: "Online medical visits." },
];
const TYPED = ["cellular energy", "muscle", "weight loss", "longevity"];
const VITALITY = ["Vitality", "Energy", "Recovery"];

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Take a Quick Health Assessment",
    body: "A short online questionnaire helps determine the right treatment for you.",
  },
  {
    icon: Stethoscope,
    title: "Doctor Review & Approval",
    body: "Licensed physicians review your profile and prescribe treatment if eligible.",
  },
  {
    icon: Zap,
    title: "Fast, Discreet Delivery",
    body: "Your medication is shipped directly to your door with ongoing support.",
  },
];

const FAQS = [
  {
    q: "What is OBU Health?",
    a: "OBU Health is an online telemedicine platform offering personalized treatments for weight loss, longevity and muscle support, prescribed by licensed providers when eligible.",
  },
  {
    q: "What is the OBU Health process?",
    a: "Complete a short online health assessment, have a licensed physician review your profile, and, if prescribed, receive your treatment discreetly at your door with ongoing support.",
  },
  {
    q: "How much does OBU Health cost?",
    a: "Treatments start at $149/month. Pricing depends on the treatment prescribed, and no insurance is required.",
  },
];

/* ---------- helpers ---------- */

const rise = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: EASE },
} as const;

function useTypewriter(words: string[], speed = 95, hold = 1500) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[i % words.length];
    let t: ReturnType<typeof setTimeout> | undefined;
    if (!deleting && text === word) t = setTimeout(() => setDeleting(true), hold);
    else if (deleting && text === "") {
      setDeleting(false);
      setI((n) => n + 1);
    } else {
      t = setTimeout(
        () => setText(word.slice(0, text.length + (deleting ? -1 : 1))),
        deleting ? 45 : speed,
      );
    }
    return () => clearTimeout(t);
  }, [text, deleting, i, words, speed, hold]);
  return text;
}

function Caret() {
  return (
    <span
      aria-hidden
      className="ml-[0.06em] inline-block w-[0.04em] animate-pulse bg-current align-[-0.05em]"
      style={{ height: "0.95em" }}
    />
  );
}

/** Photo slot: shows /obu/<file> once you add it, otherwise leaves the gradient. */
function Photo({ file, alt, className = "" }: { file: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <img src={`/obu/${file}`} alt={alt} loading="lazy" onError={() => setOk(false)} className={className} />
  );
}

/** "Start Now" pill + round arrow button, 44px tall like the original. */
function Cta({ to = START, children = "Get Started" }: { to?: string; children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Link
        to={to}
        className="inline-flex h-10 items-center rounded-full bg-[#0b0b0b] px-5 text-[15px] font-normal text-white transition hover:bg-black/75 md:h-11 md:px-6 min-[1500px]:text-[17px]"
      >
        {children}
      </Link>
      <Link
        to={to}
        aria-label="Go"
        className="grid h-10 w-10 place-items-center rounded-full bg-[#0b0b0b] text-white transition hover:bg-black/75 md:h-11 md:w-11"
      >
        <ArrowRight className="h-4 w-4" />
      </Link>
    </span>
  );
}

/**
 * Bottle behaviour from the original: it rests tilted (about -19deg), slightly smaller and
 * sunk into the card; when the card is hovered it straightens, grows and rises.
 * The parent must have the `group` class and `overflow-hidden`.
 */
function TiltVial({
  p,
  className = "",
}: {
  p: Product;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute origin-bottom rotate-[-19deg] translate-y-[14%] scale-[.88] transition-all duration-700 ${VIAL_EASE} group-hover:translate-y-0 group-hover:rotate-0 group-hover:scale-100 ${className}`}
    >
      <ProductVial id={p.id} variant={p.variant} label={p.label} className="block h-auto w-full drop-shadow-[0_18px_24px_rgba(0,0,0,.18)]" />
    </div>
  );
}

function ProductCard({ p, bg }: { p: Product; bg: string }) {
  return (
    <motion.div
      {...rise}
      className={`group relative flex aspect-[479/590] flex-col justify-between overflow-hidden ${RADIUS} ${PAD}`}
      style={{ background: bg }}
    >
      <div className="relative z-10">
        <p className={`${SMALL} text-black/60`}>{p.name}</p>
        <p className={`mt-1 max-w-[60%] ${SMALL} leading-snug text-black/75`}>{p.desc}</p>
      </div>
      <TiltVial p={p} className="bottom-[14%] left-1/2 w-[27%] -translate-x-1/2" />
      <div className="relative z-10">
        <p className={`${SMALL} text-black/55`}>Starting from</p>
        <p className="mb-3 font-heading text-[clamp(1.5rem,1.7vw,2rem)] font-normal leading-tight">
          ${p.price}
          <span className="text-[0.55em]">{p.per}</span>
        </p>
        <Cta to={`/product/${p.id}`}>Get Started</Cta>
      </div>
    </motion.div>
  );
}

function CountDown({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration: 2.4,
      delay: 0.4,
      ease: EASE,
      onUpdate: (x) => setV(Math.round(x)),
    });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v === 0 ? "0" : `-${v}`}%</span>;
}

function Gauge({ weight }: { weight: number }) {
  const ticks = Array.from({ length: 31 }, (_, i) => i);
  const lit = Math.round(((weight - 100) / 300) * 30);
  return (
    <svg viewBox="0 0 400 190" className="mx-auto w-full max-w-[34rem]">
      {ticks.map((i) => {
        const a = Math.PI - (i / 30) * Math.PI;
        const r1 = 190;
        const r2 = i % 5 === 0 ? 150 : 165;
        return (
          <line
            key={i}
            x1={200 + r1 * Math.cos(a)}
            y1={190 - r1 * Math.sin(a)}
            x2={200 + r2 * Math.cos(a)}
            y2={190 - r2 * Math.sin(a)}
            stroke={i <= lit ? "#111" : "#8f96ad"}
            strokeWidth={i <= lit ? 2.4 : 1.4}
            strokeLinecap="round"
            style={{ transition: "stroke .3s" }}
          />
        );
      })}
    </svg>
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

/* ---------- page ---------- */

export default function Home() {
  const typed = useTypewriter(TYPED);
  const vitality = useTypewriter(VITALITY, 110, 2200);
  const [weight, setWeight] = useState(200);
  const loss = Math.round(weight * 0.15);
  const pct = ((weight - 100) / 300) * 100;

  return (
    <div className="overflow-x-clip bg-white font-body text-black">
      <Seo
        title="OBU Health | Online Medical Treatments"
        description="Personalized treatments for weight loss, longevity and muscle support, prescribed online by licensed providers and delivered discreetly to your door."
      />

      {/* 1. Hero */}
      <section className={`${NARROW} pt-[clamp(2rem,6.8vw,8.1rem)]`}>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className={`${H1} min-h-[2.3em] max-w-[9.5em]`}
          >
            Our best us starts with <span className="text-[#2b52e6]">{typed}</span>
            <span className="text-[#2b52e6]">
              <Caret />
            </span>
          </motion.h1>
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } } }}
            className={`space-y-[0.35em] pt-[0.2em] leading-[1.7] ${BODY}`}
          >
            {PROMISES.map(({ icon: Icon, text }) => (
              <motion.li
                key={text}
                variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } }}
                className="flex items-center gap-[0.6em] whitespace-nowrap"
              >
                <Icon className="h-[0.95em] w-[0.95em]" strokeWidth={1.5} />
                {text}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="mt-[clamp(1.5rem,5.25vw,6.25rem)] grid gap-4 md:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.12 }}
              className={`group relative aspect-[6/5] overflow-hidden ${RADIUS} ${PAD}`}
              style={{ background: c.bg }}
            >
              <h2 className="font-heading text-[clamp(1.75rem,2.1vw,2.5rem)] font-normal leading-[1.2]">
                {c.title}
              </h2>
              <p className={`mt-[0.6em] ${BODY}`}>{c.sub}</p>
              <TiltVial p={c.vial} className="-bottom-[4%] right-[9.5%] w-[25.8%]" />
              <div className="absolute bottom-[clamp(1.25rem,1.7vw,2rem)] left-[clamp(1.25rem,1.7vw,2rem)]">
                <Cta to={`/product/${c.vial.id}`}>Start Now</Cta>
              </div>
            </motion.div>
          ))}
        </div>

        {/* press strip */}
        <div className="mt-[clamp(1.5rem,3.7vw,4.4rem)] flex items-center gap-[3vw] overflow-hidden">
          <p className={`shrink-0 text-black/45 ${SMALL}`}>Trusted by treatments featured on</p>
          <div className="relative flex-1 overflow-hidden">
            <div className="onyx-marquee flex w-max items-center gap-[4vw] grayscale">
              {[...PRESS, ...PRESS, ...PRESS].map((n, i) => (
                <span
                  key={i}
                  className={`whitespace-nowrap text-[clamp(1rem,1.3vw,1.5rem)] text-black/70 ${
                    n === "FOX"
                      ? "font-black tracking-tight"
                      : n === "WSJ" || n === "Forbes"
                        ? "font-serif font-semibold"
                        : "font-black italic"
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statement */}
      <motion.section
        {...rise}
        className="mx-auto max-w-[56rem] px-4 pb-[clamp(4rem,13vw,15.5rem)] pt-[clamp(4rem,9vw,10.5rem)] text-center"
      >
        <h2 className={STATEMENT}>
          Say goodbye to pharmacy lines.
          <br />
          Stay healthy, save money, save time.
        </h2>
      </motion.section>

      {/* 3. Weight loss banner */}
      <section className={WIDE}>
        <motion.div
          {...rise}
          className={`relative grid min-h-[30rem] overflow-hidden md:aspect-[1.8] md:min-h-0 md:grid-cols-[64fr_36fr] ${RADIUS}`}
          style={{ background: "linear-gradient(110deg,#bcc7fb 0%,#dbe0fb 45%,#efeff2 100%)" }}
        >
          <svg
            aria-hidden
            viewBox="0 0 600 300"
            className="absolute inset-x-0 bottom-0 h-1/2 w-3/4"
            preserveAspectRatio="none"
          >
            <path d="M0 300V130l110 30 130-45 150 70 210-20v135z" fill="#a4b2fb" opacity="0.55" />
          </svg>
          <div className="relative flex items-end justify-center md:justify-start">
            <Photo
              file="woman.png"
              alt="Weight loss"
              className="relative z-10 h-[24rem] w-auto object-contain object-bottom md:h-[96%]"
            />
          </div>
          <div className="relative z-10 flex flex-col justify-center p-6 pb-40 md:p-0 md:pb-[10%]">
            <h2 className={H1}>
              Lose Weight.
              <br />
              Control Cravings.
            </h2>
            <p className={`mt-[1.2em] max-w-[22em] leading-relaxed ${BODY}`}>
              The average patient loses up to 10 lbs in the first month.
            </p>
            <div className="mt-6">
              <Cta />
            </div>
            <Link
              to={START}
              className={`mt-[2.5em] w-fit text-black/55 underline underline-offset-4 ${SMALL}`}
            >
              Learn more about weight loss treatments
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute bottom-5 right-5 z-20 aspect-[327/197] w-[clamp(11rem,17.2vw,20.5rem)] rounded-[clamp(1.25rem,1.6vw,1.9rem)] bg-white p-[8%] shadow-xl md:bottom-[5%] md:left-[62%] md:right-auto"
          >
            <p className="text-[clamp(.5rem,.62vw,.75rem)] font-normal uppercase tracking-wider text-black/45">
              Change of body weight
            </p>
            <div className="flex items-center justify-between">
              <p className="font-heading text-[clamp(2rem,3.8vw,4.5rem)] font-light leading-none">
                <CountDown to={15} />
              </p>
              <svg viewBox="0 0 80 60" className="h-[clamp(1.5rem,3vw,3.5rem)] w-auto">
                <motion.path
                  d="M4 8C28 10 44 44 76 52"
                  fill="none"
                  stroke="#2b52e6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.4, delay: 0.5, ease: EASE }}
                />
              </svg>
            </div>
            <p className="text-[clamp(.5rem,.62vw,.75rem)] text-black/40">of your body weight</p>
          </motion.div>
        </motion.div>

        {/* calculator + 2 products */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.68fr_1fr_1fr]">
          <motion.div
            {...rise}
            className={`flex flex-col justify-center ${RADIUS} ${PAD} py-10`}
            style={{ background: "linear-gradient(160deg,#eef0fb 0%,#f3f3f6 100%)" }}
          >
            <p className={`text-center text-black/55 ${SMALL}`}>Your potential weight loss is</p>
            <p className="mt-2 text-center font-heading text-[clamp(3rem,4.2vw,5rem)] font-light leading-none">
              {loss}
              <span className="text-[0.45em]">lbs</span>
            </p>
            <div className="mt-4">
              <Gauge weight={weight} />
            </div>
            <div className="relative mx-auto mt-[-3rem] w-full max-w-[34rem] pt-14">
              <div
                className={`absolute top-0 -translate-x-1/2 rounded-xl border border-black/10 bg-white px-4 py-2 text-center text-black/55 shadow-sm ${SMALL}`}
                style={{ left: `calc(${pct}% + ${(0.5 - pct / 100) * 18}px)` }}
              >
                Starting Weight
                <br />
                <span className="font-normal text-black">{weight}lbs</span>
              </div>
              <input
                type="range"
                min={100}
                max={400}
                step={5}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                aria-label="Starting weight in pounds"
                className="h-1 w-full cursor-pointer appearance-none rounded-full accent-black"
                style={{
                  background: `linear-gradient(to right,#111 ${pct}%,rgba(0,0,0,.15) ${pct}%)`,
                }}
              />
            </div>
          </motion.div>
          <ProductCard p={PRODUCTS[0]} bg="linear-gradient(180deg,#e3e7fb 0%,#c3cdfa 100%)" />
          <ProductCard p={PRODUCTS[1]} bg="linear-gradient(180deg,#e3e7fb 0%,#c3cdfa 100%)" />
        </div>
      </section>

      {/* 4. Longevity banner */}
      <section className={`${WIDE} mt-[clamp(4rem,9vw,10.5rem)]`}>
        <motion.div
          {...rise}
          className={`relative grid min-h-[28rem] overflow-hidden md:aspect-[2.55] md:min-h-0 md:grid-cols-2 ${RADIUS}`}
          style={{ background: "linear-gradient(110deg,#f7ede0 0%,#f6dfc0 55%,#f3cf9f 100%)" }}
        >
          <div className="relative z-10 flex flex-col justify-center p-6 md:py-0 md:pl-[6.4%] md:pr-0">
            <h2 className={`${H1} max-w-[8em]`}>Support Longevity &amp; Wellness</h2>
            <p className={`mt-[1.2em] max-w-[24em] leading-relaxed ${BODY}`}>
              Advanced treatments that support cellular health, recovery, and vitality—helping you
              feel more energized, focused, and balanced.
            </p>
            <div className="mt-6">
              <Cta />
            </div>
            <Link
              to={START}
              className={`mt-[2.5em] w-fit text-black/55 underline underline-offset-4 ${SMALL}`}
            >
              Learn more about longevity &amp; wellness treatments
            </Link>
          </div>
          <div className="relative flex items-end justify-center md:justify-end">
            <Photo
              file="couple.png"
              alt="Longevity and wellness"
              className="relative z-10 h-[22rem] w-auto object-contain object-bottom md:h-[104%]"
            />
          </div>
        </motion.div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.68fr]">
          <ProductCard p={PRODUCTS[2]} bg="linear-gradient(180deg,#f7efe5 0%,#f5d9b4 100%)" />
          <ProductCard p={PRODUCTS[3]} bg="linear-gradient(180deg,#f7efe5 0%,#f5d9b4 100%)" />
          <motion.div
            {...rise}
            className={`relative flex min-h-[22rem] flex-col items-center overflow-hidden text-center md:col-span-2 lg:col-span-1 ${RADIUS} ${PAD}`}
            style={{ background: "linear-gradient(180deg,#f4f4f4 0%,#f5dcb8 100%)" }}
          >
            <p className="font-heading text-[clamp(1.5rem,2.1vw,2.5rem)] font-light leading-snug">
              {vitality}
              <Caret />
            </p>
            <p className="font-heading text-[clamp(1.5rem,2.1vw,2.5rem)] font-light leading-snug">
              We've got you covered
            </p>
            <div className="relative mt-4 flex w-full flex-1 items-center justify-center">
              <Photo file="body.png" alt="" className="h-[70%] max-h-80 w-auto object-contain" />
              <motion.div
                aria-hidden
                className="absolute h-[14%] w-[34%] rounded-[50%] border-4 border-white/90 shadow-[0_0_28px_rgba(255,255,255,.9)]"
                animate={{ y: [-50, 50, -50], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Steps */}
      <section className={`${NARROW} pb-[clamp(4rem,9vw,10rem)] pt-[clamp(4rem,8vw,9.5rem)] text-center`}>
        <motion.div {...rise}>
          <p className={`text-black/60 ${SMALL}`}>Simple, Private, Fully Online</p>
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
              <h3 className="mt-[1.6em] max-w-[12em] text-[clamp(1rem,1.15vw,1.4rem)] font-normal leading-snug">
                {s.title}
              </h3>
              <p className={`mt-2 max-w-[17em] leading-relaxed text-black/55 ${SMALL}`}>{s.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="mx-auto max-w-[57rem] px-4 pb-[clamp(4rem,9vw,10rem)] text-center">
        <motion.div {...rise}>
          <p className={`text-black/60 ${SMALL}`}>Everything You Need to Know!</p>
          <h2 className={`${H2} mt-[0.8em]`}>Frequently Asked Questions</h2>
        </motion.div>
        <motion.div {...rise} className="mt-[clamp(2rem,4vw,4.5rem)] border-t border-black/10 text-left">
          {FAQS.map((f) => (
            <FaqRow key={f.q} {...f} />
          ))}
        </motion.div>
      </section>

      {/* 7. Product grid */}
      <section className={`${NARROW} pb-[clamp(4rem,9vw,10rem)]`}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
              className="group flex aspect-[364/511] flex-col justify-between rounded-[clamp(.75rem,1vw,1.2rem)] bg-[#f6f3ee] p-[6%]"
            >
              <div className="grid flex-1 place-items-center overflow-hidden">
                <ProductVial
                  id={p.id}
                  variant={p.variant}
                  label={p.label}
                  className="h-[88%] w-auto transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex gap-0.5 text-[#e5a823]">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                  <p className={`mt-1 text-black/55 ${SMALL}`}>{p.name}</p>
                  <p className="text-[clamp(1rem,1.1vw,1.3rem)] font-normal">${p.price.toFixed(2)}</p>
                </div>
                <Link
                  to={`/product/${p.id}`}
                  aria-label={`View ${p.name}`}
                  className="grid h-9 w-9 place-items-center rounded-full bg-[#0b0b0b] text-white transition hover:scale-110 md:h-10 md:w-10"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
