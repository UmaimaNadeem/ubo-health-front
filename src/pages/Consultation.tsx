import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Building2,
  ChevronDown,
  FileText,
  FlaskConical,
  Leaf,
  Lock,
  Pill,
  ShieldCheck,
  Stethoscope,
  Target,
  X,
} from "lucide-react";
import { Seo } from "../components/Seo";

// Replace with your own images (one per slot is better than reusing one).
// import heroImage from "../assets/doctor.webp";
import globalImage from "../assets/Dr. Joanna.png";

const BRAND = "Onyx";
const PRICE = "From 800 AED";
// Email address that receives the consultation form.
const CONSULT_EMAIL = "sohail@onyxhealth.net";

const DOCTOR = {
  name: "Dr. Joanna",
  title: "Dermatologist & Integrative Medicine Specialist",
  bio: "With over 20 years of experience, Dr. Joanna combines classical dermatology with advanced anti-age medicine, personalized nutrition, bioresonance diagnostics, peptide therapy, intravenous drips and stem cell protocols. She takes a limited number of patients and personally guides each one from thorough diagnostics to long-term results. Consultations are available in Dubai and online.",
};

const CREDENTIALS: { title: string; text: string; url?: string }[] = [
  {
    title: "Medical licence",
    text: "Licence confirming authorization to practise.",
    url: "",
  },
  {
    title: "Medical degree",
    text: "Degree confirming foundational medical training.",
    url: "",
  },
  {
    title: "Board certification",
    text: "Specialist board certification.",
    url: "",
  },
  {
    title: "Additional training",
    text: "Further training supporting the doctor's background.",
    url: "",
  },
];

const FEATURES = [
  { icon: Stethoscope, label: "Independent doctor review" },
  { icon: BadgeCheck, label: "Licensed medical professional" },
  { icon: ShieldCheck, label: "Medical suitability screening" },
  { icon: Lock, label: "Confidential consultation process" },
];

const STEPS = [
  [
    "Book the consultation",
    `Pay the ${PRICE} consultation fee directly through ${BRAND}.`,
  ],
  [
    "Scheduling and coordination",
    `${BRAND} coordinates the appointment with the independent doctor.`,
  ],
  [
    "Independent medical review",
    "The doctor reviews health background, medications, contraindications, risk factors and objectives.",
  ],
  [
    "Medical opinion",
    "The doctor may provide general guidance, request lab work, recommend in-person care, or decline suitability.",
  ],
  [
    "No automatic approval",
    "The consultation does not guarantee approval, prescription, treatment, product access, or results.",
  ],
];

const INCLUDES = [
  { icon: Activity, label: "Health background" },
  { icon: Pill, label: "Current medications" },
  { icon: AlertTriangle, label: "Contraindications" },
  { icon: ShieldCheck, label: "Risk factors" },
  { icon: Leaf, label: "Lifestyle factors" },
  { icon: Target, label: "Personal objectives" },
  { icon: FlaskConical, label: "Possible need for lab work" },
  { icon: Building2, label: "Whether in-person medical care is recommended" },
];

const TRUSTED = [
  [
    "Independent medical review",
    "Independent Doctor Consultation is a booking service for clients who want an independent medical suitability review before making advanced wellness, performance, body composition or longevity decisions.",
  ],
  [
    "Booking and coordination fee",
    `The consultation fee is ${PRICE}, paid directly to ${BRAND} for booking and coordination.`,
  ],
  [
    "Independent medical decision",
    `${BRAND} does not diagnose, prescribe, treat, approve, or guarantee product access, prescription, treatment access, or results.`,
  ],
];

const DISCLAIMERS = [
  [
    "Independent medical consultation",
    `The consultation is performed independently by the doctor. ${BRAND} is not a medical clinic and does not provide medical diagnosis, prescription, or treatment.`,
  ],
  [
    "Booking and coordination fee",
    `The ${PRICE} consultation fee is paid directly to ${BRAND} for booking and coordination of the independent consultation.`,
  ],
  [
    "No guaranteed medical outcome",
    "The consultation does not guarantee medical approval, prescription, treatment access, product access, or results.",
  ],
  [
    "Doctor's independent medical judgment",
    "Any medical opinion or decision is made solely by the doctor based on the client's individual profile.",
  ],
];

const FAQS = [
  [
    `Is ${BRAND} a medical clinic?`,
    `No. ${BRAND} is not a medical clinic. ${BRAND} books and coordinates the consultation; the medical review is performed independently by a licensed doctor.`,
  ],
  [
    "Does the consultation guarantee approval?",
    "No. The consultation does not guarantee approval, treatment access, product access, or any particular result.",
  ],
  [
    "Does this guarantee a prescription?",
    "No. Any medical opinion or decision is made solely by the independent doctor, based on your individual profile.",
  ],
  [
    `Who receives the ${PRICE} payment?`,
    `The ${PRICE} fee is paid to ${BRAND} for booking and coordination of the independent consultation.`,
  ],
];

function Photo({
  alt,
  eager,
}: {
  alt: string;
  eager?: boolean;
}) {
  return (
    <img
      src={globalImage}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      className="h-full w-full object-cover"
    />
  );
}

// Opens the consultation form. Shared through context so every CTA on the page works.
const FormContext = createContext<() => void>(() => {});

// Defined OUTSIDE the page component so it isn't re-created on every render.
function Cta({ light }: { light?: boolean }) {
  const openForm = useContext(FormContext);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={openForm}
        className={`cursor-pointer rounded-xl px-8 py-3.5 text-sm font-bold shadow-md transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          light
            ? "bg-white text-primary"
            : "bg-accent text-accent-foreground shadow-accent/30"
        }`}
      >
        Book consultation – {PRICE}
      </button>
    </div>
  );
}

const GOALS = [
  "Digestion",
  "Energy / fatigue",
  "Weight management",
  "Hormonal balance",
  "Sleep / stress",
  "Nutrition & supplements",
  "Other",
];

const EMPTY_FORM = {
  fullName: "",
  age: "",
  country: "",
  email: "",
  whatsapp: "",
  concern: "",
  background: "",
  otherGoal: "",
  notes: "",
};

const inputClass =
  "mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {hint && (
        <span className="ml-1 font-normal text-muted-foreground">{hint}</span>
      )}
      {children}
    </label>
  );
}

function ConsultationForm({ onClose }: { onClose: () => void }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [goals, setGoals] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  // Close on Escape and lock page scroll while the form is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const set =
    (key: keyof typeof EMPTY_FORM) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const toggleGoal = (goal: string) =>
    setGoals((g) =>
      g.includes(goal) ? g.filter((x) => x !== goal) : [...g, goal],
    );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const goalLines = goals.map((g) =>
      g === "Other" ? `Other: ${values.otherGoal || "-"}` : g,
    );

    const message = [
      "Online Consultation Form",
      "",
      "1. Your Details",
      `Full name: ${values.fullName}`,
      `Age: ${values.age}`,
      `Country: ${values.country}`,
      `Email: ${values.email}`,
      `WhatsApp: ${values.whatsapp}`,
      "",
      "2. Main Concern",
      values.concern,
      "",
      "3. Health Background",
      values.background || "-",
      "",
      "4. Your Goals",
      goalLines.length ? goalLines.join(", ") : "-",
      "",
      "Anything else important:",
      values.notes || "-",
    ].join("\n");

    // Not dynamic: opens the visitor's email app with the answers pre-filled,
    // addressed to CONSULT_EMAIL. To send without an email app, replace this
    // with a fetch() call to a form service or your own API.
    const subject = `Consultation request - ${values.fullName}`;
    window.location.href = `mailto:${CONSULT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(message.replace(/\n/g, "\r\n"))}`;
    setSent(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consult-form-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-background p-6 text-foreground shadow-xl sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close form"
          className="absolute right-4 top-4 cursor-pointer rounded-full p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        {sent ? (
          <div className="py-8 text-center">
            <h2
              id="consult-form-title"
              className="text-2xl font-black tracking-tight"
            >
              Thank you
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Your details are ready in your email app. Press send and our team
              will contact you to arrange the {PRICE} consultation. If nothing
              opened, email us directly at {CONSULT_EMAIL}.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 cursor-pointer rounded-xl bg-accent px-8 py-3 text-sm font-bold text-accent-foreground"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2
                id="consult-form-title"
                className="text-2xl font-black tracking-tight"
              >
                Online consultation form
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Consultation fee: {PRICE}. Fields marked * are required.
              </p>
            </div>

            <fieldset className="space-y-3">
              <legend className="font-bold">1. Your details</legend>
              <Field label="Full name *">
                <input
                  required
                  autoComplete="name"
                  value={values.fullName}
                  onChange={set("fullName")}
                  className={inputClass}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Age *">
                  <input
                    required
                    type="number"
                    min={18}
                    max={120}
                    inputMode="numeric"
                    value={values.age}
                    onChange={set("age")}
                    className={inputClass}
                  />
                </Field>
                <Field label="Country *">
                  <input
                    required
                    autoComplete="country-name"
                    value={values.country}
                    onChange={set("country")}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Email *">
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={set("email")}
                    className={inputClass}
                  />
                </Field>
                <Field label="WhatsApp *">
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    placeholder="+971..."
                    value={values.whatsapp}
                    onChange={set("whatsapp")}
                    className={inputClass}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-bold">2. Main concern</legend>
              <Field label="What would you like help with? *">
                <textarea
                  required
                  rows={3}
                  placeholder="Briefly describe your symptoms and when they started."
                  value={values.concern}
                  onChange={set("concern")}
                  className={inputClass}
                />
              </Field>
            </fieldset>

            <fieldset>
              <legend className="font-bold">3. Health background</legend>
              <Field label="Medical conditions, allergies, surgeries, or current medications/supplements">
                <textarea
                  rows={3}
                  value={values.background}
                  onChange={set("background")}
                  className={inputClass}
                />
              </Field>
            </fieldset>

            <fieldset>
              <legend className="font-bold">4. Your goals</legend>
              <p className="mt-1 text-sm text-muted-foreground">
                What would you most like to improve?
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {GOALS.map((goal) => (
                  <label
                    key={goal}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={goals.includes(goal)}
                      onChange={() => toggleGoal(goal)}
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                    {goal}
                  </label>
                ))}
              </div>
              {goals.includes("Other") && (
                <input
                  aria-label="Other goal"
                  placeholder="Other: please specify"
                  value={values.otherGoal}
                  onChange={set("otherGoal")}
                  className={inputClass}
                />
              )}
            </fieldset>

            <Field label="Anything else important for us to know?">
              <textarea
                rows={3}
                value={values.notes}
                onChange={set("notes")}
                className={inputClass}
              />
            </Field>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-accent-foreground shadow-md transition hover:scale-[1.01]"
            >
              Submit by email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  intro,
  dark,
  children,
}: {
  title: string;
  intro?: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <section className={dark ? "bg-primary text-primary-foreground" : ""}>
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-black tracking-tight md:text-4xl">
          {title}
        </h2>

        {intro && (
          <p
            className={`mx-auto mt-4 max-w-2xl text-center text-sm md:text-base ${
              dark ? "text-primary-foreground/75" : "text-muted-foreground"
            }`}
          >
            {intro}
          </p>
        )}

        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export default function Consultation() {
  const doctorShortName = DOCTOR.name.split(",")[0];
  const [formOpen, setFormOpen] = useState(false);
  const openForm = useCallback(() => setFormOpen(true), []);
  const closeForm = useCallback(() => setFormOpen(false), []);

  return (
    <FormContext.Provider value={openForm}>
    <div>
      <Seo
        title={`Independent Doctor Consultation | ${BRAND}`}
        description="Book a private one-to-one consultation with an independent licensed doctor to review medical suitability, health background, medications and risk factors."
      />

      {/* Hero */}
      <section className="border-b bg-secondary">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-3 text-sm font-semibold text-accent">
              Premium Medical Concierge Service
            </p>

            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Independent consultation with {doctorShortName}
            </h1>

            <p className="mt-5 max-w-xl text-muted-foreground">
              Book an independent doctor consultation to review medical
              suitability, health background, medications, risk factors,
              contraindications and personal objectives.
            </p>

            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              The doctor acts independently. {BRAND} does not diagnose,
              prescribe, treat, approve, or guarantee product access,
              prescription, treatment access, or results.
            </p>

            <div className="mt-6 flex justify-start">
              <Cta />
            </div>

            <ul className="mt-5 space-y-1 text-sm text-muted-foreground">
              <li>Independent medical review.</li>
              <li>Confidential medical consultation.</li>
            </ul>
          </div>

          <div className="aspect-[4/3] overflow-hidden rounded-2xl">
            <Photo alt="Independent doctor" eager />
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-8 md:grid-cols-4">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border bg-card p-4"
          >
            <Icon className="h-6 w-6 shrink-0 text-accent" aria-hidden />
            <span className="text-sm font-semibold">{label}</span>
          </div>
        ))}
      </div>

      {/* Trusted path */}
      <Section
        dark
        title="A trusted path to independent medical review"
        intro={`A premium consultation service designed to connect clients with an independent doctor for a personalized medical suitability assessment. ${BRAND} manages booking and coordination, while all medical opinions and decisions remain solely with the independent doctor.`}
      >
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-6">
            {TRUSTED.map(([t, d]) => (
              <div key={t}>
                <h3 className="text-lg font-bold">{t}</h3>
                <p className="mt-1 text-sm text-primary-foreground/75">{d}</p>
              </div>
            ))}
          </div>

          <div className="aspect-[4/3] overflow-hidden rounded-2xl">
            <Photo alt="Independent medical consultation" />
          </div>
        </div>

        <div className="mt-10">
          <Cta light />
        </div>
      </Section>

      {/* Process */}
      <Section
        title="A simple and transparent consultation process"
        intro={`From booking to medical review, ${BRAND} coordinates the consultation journey while the independent doctor remains fully responsible for the medical assessment and opinion.`}
      >
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl">
            <Photo alt="Consultation room" />
          </div>

          <ol className="space-y-5">
            {STEPS.map(([t, d], i) => (
              <li key={t}>
                <h3 className="font-bold">
                  Step {i + 1}: {t}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10">
          <Cta />
        </div>
      </Section>

      {/* Doctor */}
      <section className="border-y bg-secondary">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Meet your medical expert
            </h2>

            <p className="mt-3 text-muted-foreground">
              Learn more about the licensed doctor conducting the independent
              medical suitability review.
            </p>

            <h3 className="mt-6 text-xl font-bold">{DOCTOR.name}</h3>
            <p className="mt-1 text-sm font-semibold text-accent">{DOCTOR.title}</p>

            <p className="mt-2 text-sm text-muted-foreground">{DOCTOR.bio}</p>

            <p className="mt-3 text-sm text-muted-foreground">
              Her role is limited to independent medical suitability review.{" "}
              {BRAND} does not influence the doctor's medical opinion.
            </p>

            <div className="mt-6 flex">
              <Cta />
            </div>
          </div>

          <div className="aspect-[4/5] overflow-hidden rounded-2xl">
            <Photo alt={DOCTOR.name} />
          </div>
        </div>
      </section>

      {/* Credentials */}
      {/* <Section
        title="Verified medical credentials"
        intro="A selection of professional qualifications and training records supporting the doctor's medical background."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CREDENTIALS.map((c) => (
            <div key={c.title} className="rounded-xl border bg-card p-5">
              <FileText className="h-6 w-6 text-accent" aria-hidden />

              <h3 className="mt-3 font-bold">{c.title}</h3>

              <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>

              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-accent hover:underline"
                >
                  View certificate
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Cta />
        </div>
      </Section> */}

      {/* What it includes */}
      <section className="border-y bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">
            What your consultation may include
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
            During the independent consultation, the doctor may review various
            aspects of your health profile to support an informed medical
            suitability assessment.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {INCLUDES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center"
              >
                <Icon className="h-6 w-6 text-accent" aria-hidden />
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Cta />
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <Section
        dark
        title="Medical disclaimer and important information"
        intro={`Please review the information below to understand the roles of ${BRAND} and the independent doctor, the consultation process, and how medical decisions are made.`}
      >
        <div className="grid gap-6 md:grid-cols-2">
          {DISCLAIMERS.map(([t, d]) => (
            <div key={t}>
              <h3 className="font-bold">{t}</h3>
              <p className="mt-1 text-sm text-primary-foreground/75">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Cta light />
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Frequently asked questions">
        <div className="mx-auto max-w-3xl divide-y rounded-xl border bg-card">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {q}
                <ChevronDown
                  className="h-4 w-4 shrink-0 transition group-open:rotate-180"
                  aria-hidden
                />
              </summary>

              <p className="mt-3 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10">
          <Cta />
        </div>
      </Section>

      {/* Final CTA */}
      <section className="border-t bg-secondary">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Book an independent medical suitability review
            </h2>

            <div className="mt-6 flex">
              <Cta />
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Independent medical review. No guaranteed approval,
              prescription, product access, treatment access, or outcome.
            </p>
          </div>

          <div className="aspect-[4/3] overflow-hidden rounded-2xl">
            <Photo alt="Consultation clinic" />
          </div>
        </div>
      </section>
    </div>

    {formOpen && <ConsultationForm onClose={closeForm} />}
    </FormContext.Provider>
  );
}