/**
 * Content for the treatment detail pages (/product/:slug).
 * Sermorelin is filled from the reference page. The other treatments use the same template;
 * review every price, claim and FAQ answer with your medical/legal team before publishing.
 */

export type Treatment = {
  slug: string;
  name: string;
  category: string;
  accent: "gold" | "blue";
  vial: { variant: "blue" | "gold"; label: string };
  headline: string;
  intro: string;
  price: number;
  per: string; // shown next to the price, e.g. "/month"
  /** Optional 3-month plan. Leave undefined to hide the 3-month option. */
  price3?: number;
  bullets: string[];
  planBullets: string[];
  plan3Bullets?: string[];
  faqs: { q: string; a: string }[];
  /** Sermorelin-only sections */
  mechanism?: { eyebrow: string; title: string };
  chart?: { eyebrow: string; title: string };
  compare?: {
    title: string;
    eyebrow: string;
    brands: string[];
    rows: { label: string; values: (string | boolean | null)[] }[];
  };
  cta: { eyebrow: string; title: string; sub: string; bullets: string[] };
};

const QUALIFY_BULLETS = ["No insurance needed", "No surprise fees", "Cancel or pause your plan anytime"];

export const TREATMENTS: Record<string, Treatment> = {
  sermorelin: {
    slug: "sermorelin",
    name: "Sermorelin",
    category: "Muscle Support",
    accent: "gold",
    vial: { variant: "gold", label: "SERMORELIN" },
    headline: "Smarter support for recovery, sleep & body composition.",
    intro:
      "Sermorelin is a peptide that prompts your body's own pituitary gland to release growth hormone naturally — supporting recovery, lean muscle, better sleep, and the energy that comes with a healthier-looking body.",
    price: 149,
    per: "/month",
    price3: 379,
    bullets: [
      "Stimulates your body's natural GH release",
      "Supports recovery, sleep, and body composition",
      "Doctor consultation, ongoing care, and dose adjustments included",
      "Self-administered nightly, shipped discreetly",
    ],
    planBullets: ["Cancel anytime", "Dose adjustments", "Doctor visit included", "Same price per vial"],
    plan3Bullets: ["Lock in your lowest rate", "Dose adjustments", "Doctor visit included", "Free expedited shipping"],
    mechanism: { eyebrow: "How Sermorelin Works", title: "Two hormones. Two pathways. One molecule." },
    chart: { eyebrow: "The GH gap", title: "Your natural GH production declines with age" },
    compare: {
      eyebrow: "Why pay more for fewer answers?",
      title: "How OBU Health™ Compares",
      brands: ["OBU Health™", "Eden", "hims", "wegovy"],
      // TODO: competitor figures were not legible in the screenshot. Verify every value before launch.
      rows: [
        { label: "Starting price / month", values: ["$149", "$229", "$480+", "$1,349"] },
        { label: "Stimulates natural GH release", values: [true, true, null, false] },
        { label: "Doctor visit included", values: [true, true, "Variable", false] },
        { label: "Self-administered at home", values: [true, true, "Variable", "Insurance only"] },
        { label: "Pause / cancel any time", values: [true, true, false, false] },
        { label: "4-test pharmacy quality panel", values: [true, false, false, false] },
      ],
    },
    faqs: [
      {
        q: "What is sermorelin?",
        a: "Sermorelin is a synthetic version of the first 29 amino acids of growth-hormone-releasing hormone (GHRH). It signals the pituitary gland to release your body's own growth hormone.",
      },
      {
        q: "How is sermorelin different from HGH?",
        a: "HGH is growth hormone itself, injected directly. Sermorelin prompts your pituitary to make and release growth hormone on its own, so your body's natural feedback loops stay in play.",
      },
      {
        q: "How long until I notice changes?",
        a: "Responses vary. Many people report changes in sleep and recovery first, while body-composition changes are gradual and take longer. Your provider will review your progress and adjust your dose.",
      },
      {
        q: "What are the side effects?",
        a: "Reported side effects include redness or irritation at the injection site, headache, flushing and dizziness. Your provider will review your history and explain what to watch for.",
      },
      {
        q: "Is compounded sermorelin FDA-approved?",
        a: "Compounded medications are not FDA-approved and are not reviewed by the FDA for safety or effectiveness. They are prepared by a licensed pharmacy when a provider determines it is appropriate for you.",
      },
      {
        q: "Can I combine sermorelin with NAD+ or GLP-1s?",
        a: "Some patients use more than one treatment. Whether that is appropriate depends on your health profile, and your provider will decide with you during your visit.",
      },
    ],
    cta: {
      eyebrow: "Ready when you are",
      title: "Sleep deeper. Recover faster. Naturally.",
      sub: "Two minutes. No appointment. No insurance. Just answers.",
      bullets: QUALIFY_BULLETS,
    },
  },

  tirzepatide: {
    slug: "tirzepatide",
    name: "Tirzepatide",
    category: "Weight Loss",
    accent: "blue",
    vial: { variant: "blue", label: "TIRZEPATIDE GLP-1/GIP" },
    headline: "Dual-action support for weight loss and metabolic balance.",
    intro:
      "Tirzepatide works on both GLP-1 and GIP receptors to help regulate appetite and blood sugar, supporting steady weight loss alongside nutrition and activity.",
    price: 239,
    per: "/month",
    bullets: [
      "Dual-action GLP-1/GIP support",
      "Helps reduce appetite and cravings",
      "Doctor consultation and ongoing care included",
      "Weekly self-administered dose, shipped discreetly",
    ],
    planBullets: ["Cancel anytime", "Dose adjustments", "Doctor visit included", "Shipped to your door"],
    faqs: [
      {
        q: "What is tirzepatide?",
        a: "Tirzepatide is a once-weekly medication that activates both GLP-1 and GIP receptors. It is used to help with weight management and blood sugar control.",
      },
      {
        q: "Who is a candidate?",
        a: "Eligibility depends on your health history, weight and goals. A licensed provider reviews your assessment and decides whether treatment is appropriate.",
      },
      {
        q: "What are the common side effects?",
        a: "Nausea, diarrhea, constipation and decreased appetite are the most commonly reported, especially when starting or increasing a dose. Your provider will explain what to watch for.",
      },
    ],
    cta: {
      eyebrow: "Ready when you are",
      title: "Take the first step toward lasting change.",
      sub: "Two minutes. No appointment. No insurance. Just answers.",
      bullets: QUALIFY_BULLETS,
    },
  },

  semaglutide: {
    slug: "semaglutide",
    name: "Semaglutide GLP-1",
    category: "Weight Loss",
    accent: "blue",
    vial: { variant: "blue", label: "SEMAGLUTIDE GLP-1" },
    headline: "Clinically backed support for appetite control and sustainable weight loss.",
    intro:
      "Semaglutide is a GLP-1 medication that helps regulate appetite and blood sugar, supporting gradual, sustainable weight loss alongside healthy habits.",
    price: 190,
    per: "/month",
    bullets: [
      "GLP-1 support for appetite control",
      "Helps you feel full for longer",
      "Doctor consultation and ongoing care included",
      "Weekly self-administered dose, shipped discreetly",
    ],
    planBullets: ["Cancel anytime", "Dose adjustments", "Doctor visit included", "Shipped to your door"],
    faqs: [
      {
        q: "What is semaglutide?",
        a: "Semaglutide is a once-weekly GLP-1 receptor agonist used to help with weight management and blood sugar control.",
      },
      {
        q: "Who is a candidate?",
        a: "Eligibility depends on your health history, weight and goals. A licensed provider reviews your assessment and decides whether treatment is appropriate.",
      },
      {
        q: "What are the common side effects?",
        a: "Nausea, vomiting, diarrhea and constipation are the most commonly reported, especially early on or after a dose increase. Your provider will explain what to watch for.",
      },
    ],
    cta: {
      eyebrow: "Ready when you are",
      title: "Control cravings. Feel in control again.",
      sub: "Two minutes. No appointment. No insurance. Just answers.",
      bullets: QUALIFY_BULLETS,
    },
  },

  "nad-injection": {
    slug: "nad-injection",
    name: "NAD+ Injection",
    category: "Longevity",
    accent: "gold",
    vial: { variant: "gold", label: "NAD+" },
    headline: "Support your energy, clarity and cellular health.",
    intro:
      "NAD+ is a coenzyme found in every cell that plays a role in energy metabolism. Our NAD+ injection is designed to support energy, mental clarity and healthy aging.",
    price: 219,
    per: "",
    bullets: [
      "Supports cellular energy and metabolism",
      "Designed to support mental clarity and focus",
      "Doctor consultation and ongoing care included",
      "Self-administered, shipped discreetly",
    ],
    planBullets: ["Cancel anytime", "Dose adjustments", "Doctor visit included", "Shipped to your door"],
    faqs: [
      {
        q: "What is NAD+?",
        a: "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme involved in energy production and cellular repair. Levels decline with age.",
      },
      {
        q: "Who is a candidate?",
        a: "A licensed provider reviews your health history and goals and decides whether NAD+ is appropriate for you.",
      },
      {
        q: "What are the common side effects?",
        a: "Flushing, nausea and mild discomfort at the injection site have been reported. Your provider will explain what to watch for and how to adjust your dose.",
      },
    ],
    cta: {
      eyebrow: "Ready when you are",
      title: "More energy. More clarity. Naturally.",
      sub: "Two minutes. No appointment. No insurance. Just answers.",
      bullets: QUALIFY_BULLETS,
    },
  },
};
