/**
 * Content for the treatment detail pages (/product/:slug).
 * All four treatments (Sermorelin, Tirzepatide, Semaglutide, NAD+) use the same template and the same sections:
 * hero, plans, mechanism banner, stat cards, 3 steps, comparison table, FAQ and final CTA.
 * Review every price, claim, competitor figure and FAQ answer with your medical/legal team before publishing.
 */

export type BulletIcon =
  | "price"
  | "shipping"
  | "care"
  | "cancel"
  | "target"
  | "trial"
  | "energy"
  | "moon"
  | "syringe"
  | "direct";

/** A hotspot on the mechanism banner. x / y are percentages of the art; `side` is where the card opens. */
export type Callout = { x: number; y: number; side: "left" | "right"; title: string; body: string };

export type Plan = {
  label: string; // "Monthly", "3-Month"...
  months: number;
  price: number;
  /** Small black pill above the card, e.g. "Most Popular" */
  badge?: string;
  bullets: string[];
  cta: string;
};

export type Treatment = {
  slug: string;
  name: string;
  category: string;
  accent: "gold" | "blue";
  vial: { variant: "blue" | "gold"; label: string };
  headline: string;
  intro: string;
  price: number; // monthly price
  per: string; // shown next to the price, e.g. "/month"
  /** Small grey text next to the hero price, e.g. "Semaglutide" */
  priceNote?: string;
  /** Typewriter caption under the "everything in the box" carousel. Default: "Compounded <name>". */
  kitCaption?: string;
  /** Hero button text. Defaults to "See if I qualify". */
  ctaLabel?: string;
  bullets: string[];
  /** One icon per hero bullet (same order). Falls back to a default set. */
  bulletIcons?: BulletIcon[];
  /** Plan cards. Plans[0] should be the monthly plan. Leave undefined to hide the plans section + hero selector. */
  plans?: Plan[];
  plansEyebrow?: string;
  faqs: { q: string; a: string }[];
  mechanism?: {
    /** "diagram" = abstract animated art, "body" = translucent body + hotspots, "molecule" = glowing NAD+ molecule art */
    kind: "diagram" | "body" | "molecule";
    eyebrow: string;
    title: string;
    callouts?: Callout[];
  };
  /** Left stat card. gh / nad = decline-with-age chart, weight = interactive weight-loss estimate. */
  chart?: { kind: "gh" | "nad" | "weight"; eyebrow: string; title: string; pct?: number };
  compare?: {
    title: string;
    eyebrow: string;
    brands: string[];
    rows: { label: string; values: (string | boolean | null)[] }[];
  };
  /** Image slots in /public/obu (all optional, the page has fallbacks) */
  lifestyle?: string; // 4th gallery image, default couple.png
  ctaPhoto?: string; // final banner photo, default man.png
  cta: { eyebrow: string; title: string; sub: string; bullets: string[]; label?: string };
};

const QUALIFY_BULLETS = [
  "No insurance needed",
  "No surprise fees",
  "Cancel or pause your plan anytime",
];

const FDA_COMPOUNDED =
  "Compounded medications are not FDA-approved and are not reviewed by the FDA for safety or effectiveness. They are prepared by a licensed pharmacy when a provider determines it is appropriate for you.";

const GLP_PLAN_BULLETS = {
  monthly: [
    "Cancel anytime",
    "Doctor visit included",
    "Free expedited shipping",
    "Ongoing dose adjustments",
  ],
  quarterly: [
    "Best per-month value",
    "Doctor visit included",
    "Free expedited shipping",
    "Same price at every dose",
  ],
  half: [
    "Lock in our lowest rate",
    "Doctor visit included",
    "Free expedited shipping",
    "Ongoing dose adjustments",
  ],
};

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
    bullets: [
      "Stimulates your body's natural GH release",
      "Supports recovery, sleep, and body composition",
      "Doctor consultation, ongoing care, and dose adjustments included",
      "Self-administered nightly, shipped discreetly",
    ],
    plans: [
      {
        label: "Monthly Plan",
        months: 1,
        price: 149,
        bullets: [
          "Cancel anytime",
          "Dose adjustments",
          "Doctor visit included",
          "Same price per vial",
        ],
        cta: "Choose Monthly",
      },
      {
        label: "3-Month",
        months: 3,
        price: 379,
        bullets: [
          "Lock in your lowest rate",
          "Dose adjustments",
          "Doctor visit included",
          "Free expedited shipping",
        ],
        cta: "Choose 3-Month",
      },
    ],
    plansEyebrow: "Two ways to begin",
    mechanism: {
      kind: "diagram",
      eyebrow: "How Sermorelin Works",
      title: "Two hormones. Two pathways. One molecule.",
      callouts: [
        {
          x: 18.75,
          y: 19.6,
          side: "right",
          title: "Supports deeper sleep",
          body: "Supports your natural overnight GH rhythm, which many people notice as more restful sleep.",
        },
        {
          x: 81.25,
          y: 19.6,
          side: "left",
          title: "Aids recovery",
          body: "Growth hormone helps tissue repair, so you can recover between workouts and busy days.",
        },
        {
          x: 50,
          y: 37,
          side: "right",
          title: "Signals the pituitary",
          body: "Prompts your pituitary gland to release your body's own growth hormone, rather than replacing it.",
        },
        {
          x: 18.75,
          y: 73.9,
          side: "right",
          title: "Lean body composition",
          body: "Supports lean muscle and a healthier-looking body over time, alongside training and nutrition.",
        },
        {
          x: 81.25,
          y: 73.9,
          side: "left",
          title: "Keeps natural feedback",
          body: "Your body's own feedback loops stay in play, so release stays within a natural range.",
        },
      ],
    },
    chart: {
      kind: "gh",
      eyebrow: "The GH gap",
      title: "Your natural GH production declines with age",
    },
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
      { q: "Is compounded sermorelin FDA-approved?", a: FDA_COMPOUNDED },
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
      label: "See if I qualify",
    },
  },

  tirzepatide: {
    slug: "tirzepatide",
    name: "Tirzepatide",
    category: "Weight Loss",
    accent: "blue",
    vial: { variant: "blue", label: "TIRZEPATIDE GLP-1/GIP" },
    headline: "Two pathways. One serious shift in how your body handles food.",
    intro:
      "Compounded tirzepatide is a dual-action GLP-1/GIP medication that targets two hormone pathways at once — supporting greater appetite control, better metabolic balance, and more substantial weight loss than single-pathway treatments.",
    price: 239,
    per: "/month",
    priceNote: "Tirzepatide",
    ctaLabel: "Get Started",
    bullets: [
      "Targets two hunger pathways: GLP-1 + GIP",
      "In 72-week trials, adults lost an average of ~21% body weight.",
      "Doctor consultation, ongoing care, and dose adjustments included.",
      "Free expedited shipping. Discreet packaging.",
    ],
    bulletIcons: ["target", "trial", "care", "shipping"],
    plans: [
      {
        label: "Monthly",
        months: 1,
        price: 239,
        bullets: GLP_PLAN_BULLETS.monthly,
        cta: "Choose Monthly",
      },
      {
        label: "3-Month",
        months: 3,
        price: 589,
        badge: "Most Popular",
        bullets: GLP_PLAN_BULLETS.quarterly,
        cta: "Choose 3-Month",
      },
      {
        label: "6-Month",
        months: 6,
        price: 1074,
        bullets: GLP_PLAN_BULLETS.half,
        cta: "Choose 6-Month",
      },
    ],
    plansEyebrow: "Plan built for the long run",
    mechanism: {
      kind: "body",
      eyebrow: "How Tirzepatide Works",
      title: "Two hormones. Two pathways. One molecule.",
      callouts: [
        {
          x: 50,
          y: 14,
          side: "left",
          title: "Builds momentum over weeks",
          body: "Effects compound as you titrate up. Your provider adjusts your dose based on response, not a fixed protocol.",
        },
        {
          x: 50,
          y: 46,
          side: "right",
          title: "Activates GLP-1 receptors",
          body: "Slows stomach emptying and reduces hunger signals — the same mechanism behind semaglutide.",
        },
        {
          x: 52,
          y: 58,
          side: "left",
          title: "Activates GIP receptors",
          body: "Adds a second layer of appetite suppression and improves how your body uses glucose and stores fat.",
        },
        {
          x: 44,
          y: 70,
          side: "right",
          title: "Improves insulin sensitivity",
          body: "Helps your body release insulin in a more measured way after eating, supporting blood-sugar balance.",
        },
      ],
    },
    chart: { kind: "weight", eyebrow: "Your potential weight loss is", title: "", pct: 0.15 },
    compare: {
      eyebrow: "Why pay more for fewer answers?",
      title: "How OBU Health™ Compares",
      brands: ["OBU Health™", "Eden", "hims", "Zepbound"],
      // TODO: verify every competitor value before launch.
      rows: [
        { label: "Starting price/month", values: ["$239", "$209", "$249", "$1,828"] },
        { label: "Membership Fee", values: ["$0", "$0", "+$25", null] },
        { label: "Same price at every dose", values: [true, true, false, false] },
        { label: "Doctor-led care included", values: [true, true, true, "Insurance only"] },
        { label: "Free expedited shipping", values: [true, true, false, false] },
        { label: "Pause / cancel anytime", values: [true, true, true, false] },
      ],
    },
    faqs: [
      {
        q: "How is tirzepatide different from semaglutide?",
        a: "Semaglutide activates the GLP-1 receptor. Tirzepatide activates both the GLP-1 and GIP receptors, which is why it is called a dual-action medication. Your provider will help decide which is the better fit for your health history and goals.",
      },
      {
        q: "How much weight can I expect to lose?",
        a: "Results vary with dose, consistency, nutrition and activity. In clinical trials of the FDA-approved version, adults on higher doses lost an average of roughly 15–21% of body weight over 72 weeks. Compounded medications have not been studied the same way, and individual results vary.",
      },
      {
        q: "Do I need insulin?",
        a: "No. Tirzepatide is not insulin. It is a once-weekly injection that works on GLP-1 and GIP hormone receptors. Tell your provider about any diabetes medication you take, since doses may need to be adjusted.",
      },
      {
        q: "What are the most common side effects?",
        a: "Nausea, diarrhea, constipation, vomiting and decreased appetite are the most commonly reported, especially when starting or increasing a dose. Your provider will review the risks with you and explain what to watch for.",
      },
      { q: "Is compounded tirzepatide FDA approved?", a: FDA_COMPOUNDED },
      {
        q: "Can I cancel my plan?",
        a: "Yes. You can pause or cancel your plan anytime, and there are no membership fees. For prepaid multi-month plans, see our Returns & Refunds policy for how the remaining time is handled.",
      },
    ],
    lifestyle: "man-measure.png",
    ctaPhoto: "tirzepatide-cta.png",
    cta: {
      eyebrow: "Ready when you are",
      title: "Take the first step today.",
      sub: "Two minutes. No appointment. No insurance. Just answers.",
      bullets: QUALIFY_BULLETS,
      label: "Get Started",
    },
  },

  semaglutide: {
    slug: "semaglutide",
    name: "Semaglutide GLP-1",
    category: "Weight Loss",
    accent: "blue",
    vial: { variant: "blue", label: "SEMAGLUTIDE GLP-1" },
    headline: "Lose weight without losing yourself in the process.",
    intro:
      "Compounded semaglutide is a personalized GLP-1 medication that helps quiet the food noise, reduces cravings, and supports steady, sustainable weight loss — paired with care from a U.S.-licensed provider.",
    price: 190,
    per: "/month",
    priceNote: "Semaglutide",
    ctaLabel: "Get Started",
    bullets: [
      "Same price at every dose. No surprise hikes.",
      "Free expedited shipping. Discreet packaging.",
      "Doctor consultation, ongoing care, and dose adjustments included.",
      "Cancel or pause your plan anytime — no membership fees.",
    ],
    bulletIcons: ["price", "shipping", "care", "cancel"],
    plans: [
      {
        label: "Monthly",
        months: 1,
        price: 190,
        bullets: GLP_PLAN_BULLETS.monthly,
        cta: "Choose Monthly",
      },
      {
        label: "3-Month",
        months: 3,
        price: 399,
        badge: "Most Popular",
        bullets: GLP_PLAN_BULLETS.quarterly,
        cta: "Choose 3-Month",
      },
      {
        label: "6-Month",
        months: 6,
        price: 714,
        bullets: GLP_PLAN_BULLETS.half,
        cta: "Choose 6-Month",
      },
    ],
    plansEyebrow: "Plan built for the long run",
    mechanism: {
      kind: "body",
      eyebrow: "How Semaglutide Works",
      title: "It works with your body's own hormones, not against them.",
      callouts: [
        {
          x: 50,
          y: 14,
          side: "left",
          title: "Quiets the food noise",
          body: "Acts on appetite signals in the brain to help reduce cravings and constant thoughts about food.",
        },
        {
          x: 50,
          y: 46,
          side: "right",
          title: "Activates GLP-1 receptors",
          body: "Slows stomach emptying and increases fullness signals — your body's own satiety pathway, supported.",
        },
        {
          x: 52,
          y: 58,
          side: "left",
          title: "Builds momentum over weeks",
          body: "Effects build as you titrate up. Your provider adjusts your dose based on response, not a fixed protocol.",
        },
        {
          x: 44,
          y: 70,
          side: "right",
          title: "Supports blood-sugar balance",
          body: "Helps your body release insulin in a more measured way after eating.",
        },
      ],
    },
    chart: { kind: "weight", eyebrow: "Your potential weight loss is", title: "", pct: 0.15 },
    compare: {
      eyebrow: "Compare your options",
      title: "How OBU Health™ Compares",
      brands: ["OBU Health™", "Eden", "hims", "Wegovy"],
      // TODO: verify every competitor value before launch.
      rows: [
        { label: "Starting price/month", values: ["$190", "$209", "$199", "$1,499"] },
        { label: "Membership Fee", values: ["$0", "$0", "+$25", null] },
        { label: "Same price at every dose", values: [true, true, false, false] },
        { label: "Doctor-led care included", values: [true, true, true, "Insurance only"] },
        { label: "Free expedited shipping", values: [true, true, false, false] },
        { label: "Pause / cancel anytime", values: [true, true, true, false] },
      ],
    },
    faqs: [
      {
        q: "What Are GLP-1 Medications?",
        a: "GLP-1 medications mimic a natural gut hormone (glucagon-like peptide-1) that helps regulate appetite, digestion and blood sugar. They signal fullness to the brain and slow how quickly the stomach empties, which can help reduce hunger and cravings.",
      },
      {
        q: "How to take GLP-1 medications?",
        a: "Semaglutide is injected once a week under the skin of the abdomen, thigh or upper arm. Your provider will set your starting dose and a schedule for increasing it, and your first shipment includes clear instructions.",
      },
      {
        q: "How should I store GLP-1 medications?",
        a: "Store unopened vials in the refrigerator, away from light, and do not freeze them. Follow the storage and beyond-use-date instructions on your pharmacy label, as they can vary by formulation.",
      },
      {
        q: "When should I take my dose of GLP-1 medications?",
        a: "Pick one day each week and keep it consistent. It can be taken at any time of day, with or without food. If you miss a dose, contact your provider for guidance on what to do next.",
      },
      {
        q: "Can I take a dosage that I've already been on if I'm switching to you from another doctor?",
        a: "Possibly. Your OBU Health provider will review your history, your current dose and how well you have tolerated it, and then decide on a safe dose to start with. Please share your previous prescription details during your assessment.",
      },
    ],
    lifestyle: "woman-measure.png",
    ctaPhoto: "semaglutide-cta.png",
    cta: {
      eyebrow: "Ready when you are",
      title: "Take the first step today.",
      sub: "Two minutes. No appointment. No insurance. Just answers.",
      bullets: QUALIFY_BULLETS,
      label: "Get Started",
    },
  },

  "nad-injection": {
    slug: "nad-injection",
    name: "NAD+ Injection",
    category: "Longevity",
    accent: "gold",
    vial: { variant: "gold", label: "NAD+" },
    headline: "Restore the molecule your cells run on.",
    intro:
      "NAD+ is a coenzyme your cells use to produce energy and repair damage — and your levels drop steadily after age 30. Direct injection delivers it where supplements can't, supporting energy, mental clarity, and cellular health from the inside out.",
    price: 219,
    per: "",
    kitCaption: "NAD+ Injection",
    ctaLabel: "Get Started",
    bullets: [
      "Direct delivery — bypasses the digestive losses of oral supplements.",
      "Supports energy, focus, and cellular recovery.",
      "Doctor consultation, ongoing care, and dose adjustments included.",
      "Free expedited shipping. Discreet packaging.",
    ],
    bulletIcons: ["direct", "energy", "care", "shipping"],
    mechanism: {
      kind: "molecule",
      eyebrow: "How NAD+ works",
      title: "It powers the work every cell in your body does.",
      callouts: [
        {
          x: 18.75,
          y: 25,
          side: "right",
          title: "Fuels your mitochondria",
          body: "Supports the cell's power plants that turn food into usable energy.",
        },
        {
          x: 81.25,
          y: 22.9,
          side: "left",
          title: "Supports DNA repair",
          body: "Cells use NAD+ to help maintain and repair DNA as you age.",
        },
        {
          x: 16.25,
          y: 68.75,
          side: "right",
          title: "Keeps cells communicating",
          body: "Supports the signaling pathways cells rely on to stay resilient and in sync.",
        },
        {
          x: 86.25,
          y: 66.7,
          side: "left",
          title: "Clearer focus",
          body: "Brain cells have high energy demands, so cellular energy supports mental clarity.",
        },
        {
          x: 50,
          y: 85.4,
          side: "left",
          title: "Restores declining levels",
          body: "Replenishes NAD+ that falls steadily after age 30, delivered directly by injection.",
        },
      ],
    },
    chart: {
      kind: "nad",
      eyebrow: "The NAD+ gap",
      title: "Your body's NAD+ production slows as you get older",
    },
    compare: {
      eyebrow: "Why pay 6x more for fewer answers?",
      title: "How OBU Health™ Compares",
      brands: ["OBU Health™", "Eden", "hims", "Wegovy"],
      // TODO: verify every competitor value before launch (the source screenshot's "Self-administered" row looked misaligned).
      rows: [
        { label: "Starting price/month", values: ["$129", "$145", "$1,200+", "$1,499"] },
        { label: "Self-administered at home", values: [true, true, false, null] },
        { label: "Doctor-led care included", values: [true, true, "Variable", false] },
        { label: "Free shipping", values: [true, true, true, "Insurance only"] },
        { label: "Pause / cancel anytime", values: [true, true, false, false] },
        { label: "4-test pharmacy quality panel", values: [true, "Limited", "Variable", false] },
      ],
    },
    faqs: [
      {
        q: "What is NAD+ Therapy?",
        a: "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme found in every cell that is involved in energy production and cellular repair. NAD+ therapy delivers it by injection, prescribed and monitored by a licensed provider.",
      },
      {
        q: "How does NAD+ work?",
        a: "Your cells use NAD+ to turn food into usable energy and to support DNA repair and other maintenance processes. Levels decline with age, and injection delivers NAD+ directly rather than relying on digestion and absorption.",
      },
      {
        q: "What are the benefits of NAD+?",
        a: "NAD+ is designed to support cellular energy, mental clarity, focus and recovery. Individual experiences vary, and compounded NAD+ has not been evaluated by the FDA for any specific medical benefit.",
      },
      {
        q: "How often should I take NAD+?",
        a: "Dosing is personalized. Your provider will recommend a starting dose and schedule based on your goals and health history, and adjust it over time as needed.",
      },
      {
        q: "How should I store NAD+?",
        a: "Keep your vial refrigerated and protected from light, and follow the storage and beyond-use-date instructions printed on your pharmacy label.",
      },
    ],
    lifestyle: "couple.png",
    ctaPhoto: "couple.png",
    cta: {
      eyebrow: "Ready when you are",
      title: "Restore the foundation. Feel the difference.",
      sub: "Two minutes. No appointment. No insurance. Just answers.",
      bullets: QUALIFY_BULLETS,
      label: "See if I qualify",
    },
  },
};
