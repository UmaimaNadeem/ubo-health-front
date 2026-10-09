import { Link } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  RotateCcw,
  Truck,
  Cookie,
  Accessibility,
  CalendarDays,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   Company details — replace placeholders before publishing
   ────────────────────────────────────────────────────────────── */
const COMPANY = "Onyx Research Ltd";
const LAST_UPDATED = "9 July 2026";

/* ──────────────────────────────────────────────────────────────
   Types + renderer
   ────────────────────────────────────────────────────────────── */
type Clause = {
  n?: string;
  label?: string;
  text: string;
  sub?: Clause[];
};
type Section = { title: string; clauses: Clause[] };
type Policy = {
  title: string;
  tagline: string;
  icon: typeof ShieldCheck;
  sections: Section[];
};

const EMAIL_RE = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

function withEmailLinks(text: string) {
  return text.split(EMAIL_RE).map((part, i) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(part) ? (
      <a
        key={i}
        href={`mailto:${part}`}
        className="font-semibold text-foreground hover:text-blue-600"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

function ClauseList({ clauses, depth = 0 }: { clauses: Clause[]; depth?: number }) {
  return (
    <ul className={depth === 0 ? "space-y-3.5" : "mt-3 space-y-2.5 border-l border-border/70 pl-5"}>
      {clauses.map((c, i) => (
        <li key={i} className="text-sm leading-relaxed">
          <div className="flex items-baseline gap-3">
            {c.n && (
              <span className="min-w-9 shrink-0 font-mono text-xs font-bold text-accent">
                {c.n}
              </span>
            )}
            <span className="text-muted-foreground">
              {c.label && (
                <>
                  <strong className="font-semibold text-foreground">{c.label}:</strong>{" "}
                </>
              )}
              {withEmailLinks(c.text)}
            </span>
          </div>
          {c.sub && <ClauseList clauses={c.sub} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

function PolicyShell({ policy }: { policy: Policy }) {
  const Icon = policy.icon;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-accent/15 blur-[140px]"
        />
        <div className="relative mx-auto max-w-5xl px-4 py-16 md:py-20">
          <nav className="mb-6 text-xs opacity-70">
            <Link to="/" className="hover:text-accent">
              Home
            </Link>{" "}
            / <span className="opacity-90">Policies</span>
          </nav>
          <div className="flex items-start gap-5">
            <div className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent ring-1 ring-inset ring-accent/20 sm:grid">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <span className="mb-3 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
                Legal
              </span>
              <h1 className="text-3xl font-black leading-tight md:text-5xl">{policy.title}</h1>
              <p className="mt-4 max-w-2xl text-sm opacity-80 md:text-base">{policy.tagline}</p>
              <p className="mt-4 inline-flex items-center gap-2 text-xs opacity-60">
                <CalendarDays className="h-3.5 w-3.5" />
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-6xl gap-10 px-4 py-12 lg:grid lg:grid-cols-[240px_1fr]">
        {/* TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              On this page
            </h2>
            <nav className="space-y-1 border-l">
              {policy.sections.map((s, i) => (
                <a
                  key={i}
                  href={`#section-${i}`}
                  className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition hover:border-accent hover:text-accent"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Sections */}
        <article className="min-w-0">
          <div className="space-y-8">
            {policy.sections.map((s, i) => (
              <section
                key={i}
                id={`section-${i}`}
                className="scroll-mt-28 rounded-2xl border bg-card p-6 md:p-8"
              >
                <div className="mb-5 flex items-baseline gap-3">
                  <span className="min-w-9 shrink-0 font-mono text-sm font-bold text-accent md:text-base">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-lg font-black md:text-xl">{s.title}</h2>
                </div>
                <ClauseList clauses={s.clauses} />
              </section>
            ))}
          </div>

          {/* Related policies */}
          <div className="mt-10">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Related policies
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {POLICY_LINKS.filter((p) => p.title !== policy.title).map((p) => (
                <Link
                  key={p.to}
                  to={p.to}
                  className="group flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition hover:border-accent hover:shadow-sm"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-accent-foreground">
                    <p.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold group-hover:text-accent">{p.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>

      {/* Contact & company-details section hidden for now — re-enable when address/contact info is ready.
      <section className="border-t bg-secondary">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-xl font-black">Contact &amp; company details</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {COMPANY} is a company incorporated in England and Wales. For any questions about this
            policy, please get in touch.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, label: "Registered office", value: ADDRESS },
              { icon: Mail, label: "Email", value: EMAIL },
              { icon: Phone, label: "Phone", value: PHONE },
              { icon: Globe, label: "Website", value: WEBSITE },
            ].map((d) => (
              <div key={d.label} className="rounded-xl border bg-card p-4">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent/10 text-accent">
                  <d.icon className="h-4 w-4" />
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {d.label}
                </div>
                <div className="mt-1 break-words text-sm font-medium">{d.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   1. Privacy Policy
   ────────────────────────────────────────────────────────────── */
const PRIVACY: Policy = {
  title: "Privacy Policy",
  icon: ShieldCheck,
  tagline:
    "How Onyx Research gathers, uses, keeps, discloses and protects your personal data, in line with UK GDPR, the Data Protection Act 2018 and PECR.",
  sections: [
    {
      title: "Introduction",
      clauses: [
        {
          n: "1.1",
          text: `At ${COMPANY}, protecting your personal information is something we take seriously. This Privacy Policy describes the way ${COMPANY} ("Onyx Research", "we", "us" or "our") gathers, uses, keeps, discloses and protects your personal data, and we follow the standards set by the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, the Privacy and Electronic Communications Regulations (PECR) and every other UK data protection law that applies to us.`,
        },
        {
          n: "1.2",
          text: `Onyx Research is a company incorporated in England and Wales. Our registered office is in the United Kingdom.`,
        },
        {
          n: "1.3",
          text: "Whether you are a customer, a casual visitor to our site, an account holder, a business buyer or simply someone making an enquiry, this Policy explains how we treat the information we hold about you.",
        },
        {
          n: "1.4",
          text: "When you browse our website or buy from us, you confirm that you understand and accept the way we handle personal data as described here.",
        },
      ],
    },
    {
      title: "Scope of this Policy",
      clauses: [
        {
          n: "2.1",
          text: "This Policy covers the personal data we handle across each of the following:",
          sub: [
            { n: "2.1.1", text: "our website;" },
            { n: "2.1.2", text: "the accounts customers create with us;" },
            { n: "2.1.3", text: "contact by email, phone or any other electronic channel;" },
            { n: "2.1.4", text: "orders you place for Onyx Research products;" },
            {
              n: "2.1.5",
              text: "any eligibility or compliance checks we carry out, where these apply.",
            },
          ],
        },
        {
          n: "2.2",
          text: "It does not extend to our employees, contractors or outside service providers, whose information is dealt with under separate arrangements.",
        },
      ],
    },
    {
      title: "Definitions",
      clauses: [
        {
          n: "3.1",
          text: `When we say "Personal Data", we mean any information that points to a particular living person, either on its own or when combined with other details we hold.`,
        },
        {
          n: "3.2",
          text: `"Processing" refers to anything we do with that data, from collecting and storing it through to using, sharing or otherwise working with it.`,
        },
        {
          n: "3.3",
          text: `"Customer" is used broadly and covers everyday consumers as well as wellness practitioners, clinics and business purchasers.`,
        },
      ],
    },
    {
      title: "Categories of Personal Data We Collect",
      clauses: [
        {
          n: "4.1",
          label: "Identity data",
          text: "such as your full name, date of birth or age, title, and business or practitioner details where relevant.",
        },
        {
          n: "4.2",
          label: "Contact data",
          text: "billing and delivery addresses, email address and telephone numbers.",
        },
        {
          n: "4.3",
          label: "Technical data",
          text: "IP address, device identifiers, browser and session information, cookies and analytics data.",
        },
        {
          n: "4.4",
          label: "Transaction data",
          text: "order history, payment confirmations, products purchased and invoicing details.",
        },
        {
          n: "4.5",
          label: "Eligibility and verification data",
          text: "declarations confirming you are 21 or over and that products are purchased for personal adult wellness use, together with any supporting documents you choose to provide.",
        },
        {
          n: "4.6",
          label: "Communications data",
          text: "emails, support requests and other messages you send to us.",
        },
        {
          n: "4.7",
          text: "We do not store full payment card details; payments are handled securely by regulated third-party processors.",
        },
      ],
    },
    {
      title: "How We Collect Data",
      clauses: [
        {
          n: "5.1",
          label: "Directly from you",
          text: "when you place an order, create an account, complete a form, contact customer support or submit an eligibility declaration.",
        },
        {
          n: "5.2",
          label: "Automatically",
          text: "through cookies and analytics tools that gather technical data as you browse the site.",
        },
        {
          n: "5.3",
          label: "From third parties",
          text: "such as payment processors, courier systems and, where applicable, identity verification providers.",
        },
      ],
    },
    {
      title: "Legal Basis for Processing",
      clauses: [
        {
          n: "6.1",
          label: "Contractual necessity",
          text: "where processing is needed to fulfil your order or provide our services.",
        },
        {
          n: "6.2",
          label: "Legal obligation",
          text: "for tax, accounting, fraud prevention and regulatory compliance.",
        },
        {
          n: "6.3",
          label: "Legitimate interests",
          text: "where processing is reasonably necessary to:",
          sub: [
            { n: "6.3.1", text: "prevent misuse of our products;" },
            {
              n: "6.3.2",
              text: "maintain product safety, including for temperature-sensitive cold-chain items;",
            },
            { n: "6.3.3", text: "improve how our website works;" },
            { n: "6.3.4", text: "protect our legitimate commercial interests." },
          ],
        },
        {
          n: "6.4",
          label: "Consent",
          text: "for marketing communications, which you may withdraw at any time.",
        },
      ],
    },
    {
      title: "Age Verification",
      clauses: [
        { n: "7.1", text: "Only individuals aged 21 or over may purchase Onyx Research products." },
        {
          n: "7.2",
          text: "We may request proof of age where necessary to satisfy our compliance obligations.",
        },
      ],
    },
    {
      title: "How We Use Personal Data",
      clauses: [
        {
          n: "8.1",
          text: "To process and deliver your orders, including dispatch logistics and related communications.",
        },
        { n: "8.2", text: "To manage customer accounts and order history." },
        { n: "8.3", text: "To send safety, temperature-handling and regulatory notifications." },
        { n: "8.4", text: "To prevent fraud and misuse of our products." },
        { n: "8.5", text: "To comply with accounting, tax, legal and regulatory requirements." },
        { n: "8.6", text: "To improve the functionality and security of our website." },
      ],
    },
    {
      title: "Sharing Personal Data",
      clauses: [
        {
          n: "9.1",
          text: "We may share personal data with the following regulated or contractually bound parties:",
          sub: [
            { n: "9.1.1", text: "payment processors, for secure payment handling;" },
            { n: "9.1.2", text: "courier companies, for delivery and dispatch updates;" },
            { n: "9.1.3", text: "IT, hosting and security service providers;" },
            {
              n: "9.1.4",
              text: "legal, tax and regulatory authorities, where required by law;",
            },
            { n: "9.1.5", text: "professional advisers, such as lawyers and accountants." },
          ],
        },
        { n: "9.2", text: "Onyx Research does not sell personal data under any circumstances." },
      ],
    },
    {
      title: "International Transfers",
      clauses: [
        {
          n: "10.1",
          text: "We may transfer data outside the UK where our hosting or service providers require it.",
        },
        {
          n: "10.2",
          text: "Where we do, we ensure compliance using Standard Contractual Clauses, the UK Addendum or recognised adequacy decisions.",
        },
      ],
    },
    {
      title: "Data Retention",
      clauses: [
        {
          n: "11.1",
          text: "We retain personal data only for as long as necessary for lawful purposes:",
          sub: [
            { n: "11.1.1", text: "order and tax records: a minimum of 6 years;" },
            { n: "11.1.2", text: "eligibility and compliance declarations: a minimum of 7 years;" },
            { n: "11.1.3", text: "account data: until your account is closed;" },
            { n: "11.1.4", text: "marketing data: until consent is withdrawn." },
          ],
        },
      ],
    },
    {
      title: "Data Security",
      clauses: [
        {
          n: "12.1",
          text: "We implement industry-standard technical and organisational measures, including restricted access, encryption, anti-malware protections and secure backups.",
        },
        {
          n: "12.2",
          text: "Despite these precautions, no transmission or storage of data can be guaranteed entirely secure.",
        },
      ],
    },
    {
      title: "Your Rights",
      clauses: [
        {
          n: "13.1",
          text: "Under UK GDPR you have the right to:",
          sub: [
            { n: "13.1.1", text: "access your data;" },
            { n: "13.1.2", text: "request correction or deletion;" },
            { n: "13.1.3", text: "restrict processing;" },
            { n: "13.1.4", text: "object to certain processing;" },
            { n: "13.1.5", text: "request data portability;" },
            { n: "13.1.6", text: "withdraw marketing consent;" },
            {
              n: "13.1.7",
              text: "lodge a complaint with the Information Commissioner's Office (ICO).",
            },
          ],
        },
        {
          n: "13.2",
          text: `To make a request, please contact us by email at sales@onyxhealth.net.`,
        },
      ],
    },
    {
      title: "Cookies",
      clauses: [
        { n: "14.1", text: "Our website uses both essential and analytical cookies." },
        { n: "14.2", text: "Full details are set out in our Cookies Policy." },
      ],
    },
    {
      title: "Related Policies",
      clauses: [
        {
          n: "15.1",
          text: "This Privacy Policy should be read together with our:",
          sub: [
            { n: "15.1.1", text: "Terms & Conditions;" },
            { n: "15.1.2", text: "Refund Policy;" },
            { n: "15.1.3", text: "Shipping & Delivery Policy;" },
            { n: "15.1.4", text: "Cookies Policy." },
          ],
        },
      ],
    },
    {
      title: "Updates to This Policy",
      clauses: [
        { n: "16.1", text: "We may update this Policy at any time." },
        {
          n: "16.2",
          text: "The latest version will always be published on our website.",
        },
      ],
    },
    {
      title: "Contact Details",
      clauses: [
        { n: "17.1", text: `For questions about this policy, please contact ${COMPANY}.` },
        { n: "17.2", label: "Email", text: "sales@onyxhealth.net" },
      ],
    },
  ],
};

/* ──────────────────────────────────────────────────────────────
   2. Terms & Conditions
   ────────────────────────────────────────────────────────────── */
const TERMS: Policy = {
  title: "Terms & Conditions",
  icon: FileText,
  tagline:
    "The terms that apply to every purchase, order, use of our website and any other dealing you have with Onyx Research.",
  sections: [
    {
      title: "Introduction",
      clauses: [
        {
          n: "1.1",
          text: `These Terms and Conditions ("Terms") apply to every purchase, order, use of our website and any other dealing you have with ${COMPANY} ("Onyx Research", "we", "us" or "our"), including the products we supply.`,
        },
        {
          n: "1.2",
          text: `Onyx Research is a company registered in England and Wales.`,
        },
        {
          n: "1.3",
          text: "By accessing our website or purchasing any product from us, you accept these Terms in full.",
        },
      ],
    },
    {
      title: "Age and Eligibility",
      clauses: [
        { n: "2.1", text: "You must be aged 21 or over to purchase products from Onyx Research." },
        {
          n: "2.2",
          text: "When you place an order, you confirm that the information you provide is accurate and truthful.",
        },
      ],
    },
    {
      title: "Product Classification",
      clauses: [
        {
          n: "3.1",
          text: "Onyx Research products:",
          sub: [
            { n: "3.1.1", text: "are research items intended for research use only;" },
            {
              n: "3.1.2",
              text: "are supplied in a pre-measured precision pen and sealed, tamper-evident packaging;",
            },
            {
              n: "3.1.3",
              text: "are not intended to diagnose, treat, cure or prevent any disease;",
            },
            { n: "3.1.4", text: "carry no therapeutic, diagnostic or medical claims of any kind;" },
            {
              n: "3.1.5",
              text: "should be used in line with guidance from a qualified healthcare practitioner where appropriate; and",
            },
            {
              n: "3.1.6",
              text: "must be used responsibly and in accordance with the instructions supplied.",
            },
          ],
        },
      ],
    },
    {
      title: "Order Acceptance",
      clauses: [
        {
          n: "4.1",
          text: "All orders are subject to acceptance, and we may decline any order at our discretion.",
        },
        {
          n: "4.2",
          text: "An order is accepted only once you receive written confirmation from us, such as an order confirmation email.",
        },
        {
          n: "4.3",
          text: "We may cancel an order where:",
          sub: [
            { n: "4.3.1", text: "the information provided is incorrect or misleading;" },
            { n: "4.3.2", text: "we suspect misuse or misrepresentation;" },
            { n: "4.3.3", text: "regulatory, safety or supply concerns arise; or" },
            { n: "4.3.4", text: "payment is declined or reversed." },
          ],
        },
      ],
    },
    {
      title: "Customer Obligations",
      clauses: [
        {
          n: "5.1",
          text: "You warrant that:",
          sub: [
            {
              n: "5.1.1",
              text: "the information you give us is complete, accurate and not misleading;",
            },
            {
              n: "5.1.2",
              text: "you are aged 21 or over and legally able to enter into a binding contract;",
            },
            {
              n: "5.1.3",
              text: "you will use Onyx Research products responsibly for research use only, in line with section 3 and the supplied instructions, and not in any way contrary to these Terms;",
            },
            {
              n: "5.1.4",
              text: "you will store and handle all products safely and as instructed;",
            },
            { n: "5.1.5", text: "you will comply with all applicable laws and regulations." },
          ],
        },
        {
          n: "5.2",
          text: "You agree to indemnify and hold harmless Onyx Research, its directors, officers, employees and agents against any claims, losses, liabilities, damages, costs and expenses arising from:",
          sub: [
            { n: "5.2.1", text: "your breach of these Terms;" },
            { n: "5.2.2", text: "your misuse of any product;" },
            { n: "5.2.3", text: "your failure to comply with applicable laws or regulations; or" },
            { n: "5.2.4", text: "any misrepresentation you make in connection with an order." },
          ],
        },
      ],
    },
    {
      title: "KYC and Customer Verification",
      clauses: [
        {
          n: "6.1",
          text: "We may, at our discretion, request identity, age or business verification in connection with an order or where risk factors are identified.",
        },
        {
          n: "6.2",
          text: "We are not obliged to carry out such checks in every case, and the absence of a check does not create any liability for Onyx Research.",
        },
        {
          n: "6.3",
          text: "Responsibility for the lawful purchase, possession and use of products rests solely with the customer.",
        },
        {
          n: "6.4",
          text: "If you do not provide requested verification information, your order may be cancelled or left unfulfilled.",
        },
      ],
    },
    {
      title: "Pricing and Payment",
      clauses: [
        { n: "7.1", text: "All prices are shown in GBP (£) unless stated otherwise." },
        { n: "7.2", text: "Prices may be subject to VAT and other applicable taxes or duties." },
        {
          n: "7.3",
          text: "Payment is required in full when you place your order, using the payment methods offered on the website.",
        },
        {
          n: "7.4",
          text: "We may carry out fraud-prevention checks, which can occasionally delay dispatch.",
        },
        {
          n: "7.5",
          text: "If payment is not successfully received, your order will not be processed.",
        },
      ],
    },
    {
      title: "Cold-Chain and Temperature-Sensitive Products",
      clauses: [
        {
          n: "8.1",
          text: "Many Onyx Research products are temperature-sensitive and require cold-chain handling or controlled storage conditions.",
        },
        {
          n: "8.2",
          text: "Risk in the products passes to you as soon as they are delivered to the address you provide, or collected where applicable.",
        },
        {
          n: "8.3",
          text: "We cannot verify or control how products are stored after delivery, and we accept no liability for degradation, loss of potency or unsuitability caused by storage, handling or transport after delivery.",
        },
        {
          n: "8.4",
          text: "Temperature-sensitive products are strictly non-returnable and non-refundable, except where consumer law provides rights that cannot lawfully be excluded.",
        },
      ],
    },
    {
      title: "Refunds",
      clauses: [
        { n: "9.1", text: "Our Refund Policy forms part of these Terms." },
        {
          n: "9.2",
          text: "Subject to your statutory rights, no refunds will be given for:",
          sub: [
            {
              n: "9.2.1",
              text: "cold-chain or temperature-sensitive products once they have been dispatched;",
            },
            {
              n: "9.2.2",
              text: "products that have been opened, used, stored incorrectly or tampered with after delivery;",
            },
            {
              n: "9.2.3",
              text: "products damaged through customer mishandling or a failure to follow instructions.",
            },
          ],
        },
        {
          n: "9.3",
          text: "Any refund offered as a goodwill gesture is entirely at our discretion and does not waive these Terms.",
        },
      ],
    },
    {
      title: "Shipping",
      clauses: [
        { n: "10.1", text: "Our Shipping & Delivery Policy forms part of these Terms." },
        {
          n: "10.2",
          text: "Any delivery timeframes we or our couriers provide are estimates only and are not guaranteed.",
        },
        {
          n: "10.3",
          text: "We are not liable for delays caused by couriers, customs, regulatory checks or other events beyond our reasonable control.",
        },
        {
          n: "10.4",
          text: "You are responsible for ensuring products may be lawfully imported into the destination country and for paying any customs duties, taxes or charges.",
        },
      ],
    },
    {
      title: "Limitation of Liability",
      clauses: [
        {
          n: "11.1",
          text: "To the fullest extent permitted by law, Onyx Research shall not be liable for:",
          sub: [
            {
              n: "11.1.1",
              text: "any misuse of products, or any use contrary to the supplied instructions or these Terms;",
            },
            {
              n: "11.1.2",
              text: "any loss, damage or injury arising from a failure to follow these Terms or the instructions supplied with the products;",
            },
            {
              n: "11.1.3",
              text: "any indirect, consequential, special or incidental loss, including loss of profit, business or opportunity.",
            },
          ],
        },
        {
          n: "11.2",
          text: "Our total aggregate liability for any claim arising out of or in connection with a contract for the supply of products will not exceed the total amount you paid for the specific order giving rise to the claim.",
        },
        {
          n: "11.3",
          text: "Nothing in these Terms limits or excludes liability for:",
          sub: [
            { n: "11.3.1", text: "death or personal injury caused by our negligence;" },
            { n: "11.3.2", text: "fraud or fraudulent misrepresentation; or" },
            {
              n: "11.3.3",
              text: "any other liability that cannot lawfully be limited or excluded.",
            },
          ],
        },
      ],
    },
    {
      title: "Intellectual Property",
      clauses: [
        {
          n: "12.1",
          text: "All trademarks, trade names, logos, packaging designs, documentation, images, website content and related intellectual property rights are owned by or licensed to Onyx Research.",
        },
        {
          n: "12.2",
          text: "You may not reproduce, modify, distribute or exploit any of our intellectual property without our prior written consent.",
        },
        {
          n: "12.3",
          text: "Buying a product does not grant any licence or right to use our intellectual property beyond what is needed for lawful use of the product itself.",
        },
      ],
    },
    {
      title: "Business-to-Business (B2B) Purchases",
      clauses: [
        {
          n: "13.1",
          text: "Where the customer is a business, clinic or other organisation, it warrants that:",
          sub: [
            {
              n: "13.1.1",
              text: "it is properly incorporated or established and has full capacity and authority to enter into these Terms;",
            },
            {
              n: "13.1.2",
              text: "the person placing the order is authorised to bind the organisation;",
            },
            {
              n: "13.1.3",
              text: "products will be used or onward supplied only in full compliance with all applicable laws and regulations.",
            },
          ],
        },
        {
          n: "13.2",
          text: "Resale or onward supply of products is permitted only where we agree in writing, and may be subject to additional terms, including further indemnities and territorial restrictions.",
        },
        {
          n: "13.3",
          text: "To the extent permitted by law, statutory consumer protections do not apply to B2B transactions, and liability may be further limited in any separate written agreement.",
        },
      ],
    },
    {
      title: "Force Majeure",
      clauses: [
        {
          n: "14.1",
          text: "Onyx Research is not liable for any delay or failure to perform its obligations under these Terms where this results from events or causes beyond its reasonable control, including but not limited to:",
          sub: [
            { n: "14.1.1", text: "courier or logistics failures;" },
            { n: "14.1.2", text: "supply-chain disruption;" },
            { n: "14.1.3", text: "regulatory changes or enforcement action;" },
            { n: "14.1.4", text: "natural disasters, pandemics or other acts of God;" },
            { n: "14.1.5", text: "strikes, lockouts or industrial disputes." },
          ],
        },
        {
          n: "14.2",
          text: "In such circumstances, our obligations are suspended for the duration of the event.",
        },
      ],
    },
    {
      title: "Suspension and Termination",
      clauses: [
        {
          n: "15.1",
          text: "We may suspend or terminate any order, account or access to our services immediately where:",
          sub: [
            { n: "15.1.1", text: "we suspect misuse of products;" },
            { n: "15.1.2", text: "fraudulent or unlawful behaviour is identified;" },
            { n: "15.1.3", text: "you are in material breach of these Terms." },
          ],
        },
        {
          n: "15.2",
          text: "Termination does not affect any rights, remedies, obligations or liabilities that have accrued up to the date of termination.",
        },
      ],
    },
    {
      title: "Governing Law and Jurisdiction",
      clauses: [
        {
          n: "16.1",
          text: "These Terms, and any dispute or claim (including non-contractual disputes or claims) arising out of or in connection with them or their subject matter, are governed by and construed in accordance with the laws of England and Wales.",
        },
        {
          n: "16.2",
          text: "The courts of England and Wales have exclusive jurisdiction over any dispute or claim arising out of or in connection with these Terms or their subject matter.",
        },
      ],
    },
    {
      title: "Contact Information",
      clauses: [
        { n: "17.1", text: `For any questions about these Terms, please contact ${COMPANY}.` },
        { n: "17.2", label: "Email", text: "sales@onyxhealth.net" },
      ],
    },
  ],
};

/* ──────────────────────────────────────────────────────────────
   3. Refund Policy
   ────────────────────────────────────────────────────────────── */
const REFUND: Policy = {
  title: "Refund Policy",
  icon: RotateCcw,
  tagline:
    "How refund requests are handled for purchases made from Onyx Research. This Policy forms part of our Terms & Conditions.",
  sections: [
    {
      title: "Introduction",
      clauses: [
        {
          n: "1.1",
          text: `This Refund Policy governs all refund requests relating to purchases made from ${COMPANY} ("Onyx Research").`,
        },
        {
          n: "1.2",
          text: "It forms part of our Terms & Conditions and should be read alongside them.",
        },
      ],
    },
    {
      title: "Eligibility for Refunds",
      clauses: [
        {
          n: "2.1",
          text: "Because of the nature of the products we supply, many of which are temperature-sensitive, perishable and supplied in sealed packaging, refunds are strictly limited.",
        },
        {
          n: "2.2",
          text: "Risk transfers to you as soon as the order is shipped, after which we cannot assess how it has been stored.",
        },
      ],
    },
    {
      title: "Non-Refundable Products",
      clauses: [
        {
          n: "3.1",
          text: "The following items are strictly non-refundable:",
          sub: [
            {
              n: "3.1.1",
              text: "cold-chain or temperature-sensitive products once they have been dispatched;",
            },
            {
              n: "3.1.2",
              text: "any product whose sealed, tamper-evident packaging has been opened or broken;",
            },
            {
              n: "3.1.3",
              text: "products that have been opened, used, tampered with, stored incorrectly or exposed to unsuitable conditions after delivery;",
            },
            {
              n: "3.1.4",
              text: "products where a temperature excursion is suspected or confirmed.",
            },
          ],
        },
      ],
    },
    {
      title: "Damaged or Incorrect Products",
      clauses: [
        {
          n: "4.1",
          text: "Please notify us of any damage or incorrect items within 24 hours of delivery, including photographic evidence.",
        },
        { n: "4.2", text: "Reporting after this timeframe may void eligibility." },
      ],
    },
    {
      title: "Exceptional Circumstances",
      clauses: [
        {
          n: "5.1",
          text: "We may grant a refund at our discretion where required by law or in exceptional circumstances.",
        },
        { n: "5.2", text: "Any such refund does not waive our rights under this Policy." },
        {
          n: "5.3",
          text: "Cancellation and payment processing charges:",
          sub: [
            {
              n: "5.3.1",
              text: "where you request cancellation of an order after payment has been processed, we reserve the right to deduct any non-refundable payment processing fees incurred;",
            },
            {
              n: "5.3.2",
              text: "payments made by credit card, debit card, Apple Pay, Google Pay or any other card-based method may be subject to a deduction of up to 5% of the transaction value to reflect merchant processing charges, banking fees and administrative costs;",
            },
            {
              n: "5.3.3",
              text: "no refund or cancellation is available once an order has been fulfilled, prepared for dispatch, allocated for shipment, packed, labelled or otherwise entered the fulfilment process;",
            },
            {
              n: "5.3.4",
              text: "once an order has been dispatched, sections 2 and 3 of this Policy apply in full;",
            },
            {
              n: "5.3.5",
              text: "any refund we approve is made only to the original payment method used for the purchase.",
            },
          ],
        },
      ],
    },
    {
      title: "How to Request a Refund",
      clauses: [
        {
          n: "6.1",
          text: `Requests should be submitted through our contact form or by email at sales@onyxhealth.net.`,
        },
        {
          n: "6.2",
          text: "Please include your order reference, a description of the issue and supporting evidence.",
        },
      ],
    },
    {
      title: "Governing Law",
      clauses: [{ n: "7.1", text: "This Policy is governed by the laws of England and Wales." }],
    },
  ],
};

/* ──────────────────────────────────────────────────────────────
   4. Shipping & Delivery Policy
   ────────────────────────────────────────────────────────────── */
const SHIPPING: Policy = {
  title: "Shipping & Delivery Policy",
  icon: Truck,
  tagline: `This Shipping & Delivery Policy explains how orders placed with ${COMPANY} are packed, dispatched and delivered.`,
  sections: [
    {
      title: "Carrier & Handling",
      clauses: [
        {
          n: "1.1",
          text: "Every order leaves our facility via DHL Express, complete with tracking and a mandatory signature at the point of delivery.",
        },
        {
          n: "1.2",
          text: "Because Onyx Research products require careful handling, each parcel is packed with temperature controlled cooling elements to keep contents stable throughout transit.",
        },
      ],
    },
    {
      title: "Where We Deliver",
      clauses: [
        {
          n: "2.1",
          text: "At this time, our shipping network covers Europe, the United Kingdom and the Middle East exclusively (North America coming soon).",
        },
        {
          n: "2.2",
          text: "If you are located outside these regions and would like to explore delivery options, reach out to us at sales@onyxhealth.net and we will see what can be arranged.",
        },
      ],
    },
    {
      title: "Order Processing & Transit Times",
      clauses: [
        {
          n: "3.1",
          text: "Once payment clears, we prepare and dispatch orders within 1 to 3 business days.",
        },
        {
          n: "3.2",
          text: "From there, delivery generally takes another 1 to 3 business days across Europe and the UK, though actual timing varies by destination.",
        },
        {
          n: "3.3",
          text: "Busy periods or unforeseen circumstances can extend these windows.",
        },
      ],
    },
    {
      title: "Handling Temperature Sensitive Items",
      clauses: [
        {
          n: "4.1",
          text: "Because our items are sensitive to temperature, every Onyx Research package ships with frozen gel packs to preserve product integrity.",
        },
        {
          n: "4.2",
          text: "Please make sure someone is available to accept the delivery on the first attempt. We cannot take responsibility for product spoilage if a delivery fails because no one was on hand to receive it.",
        },
      ],
    },
    {
      title: "Signature on Delivery",
      clauses: [
        {
          n: "5.1",
          text: "Every shipment requires an adult signature at the delivery address supplied during checkout; DHL will not leave parcels unattended.",
        },
        {
          n: "5.2",
          text: "If no adult is present to sign, it is the customer's responsibility to work out alternate arrangements directly with DHL.",
        },
      ],
    },
    {
      title: "Getting the Address Right",
      clauses: [
        {
          n: "6.1",
          text: "It is the customer's responsibility to enter accurate, complete shipping details at checkout.",
        },
        {
          n: "6.2",
          text: "Should a delivery fail due to a mistaken address, we will attempt redirection through DHL where possible.",
        },
        {
          n: "6.3",
          text: "If the error originated on our end, we will cover the cost of reshipping; otherwise, the customer covers the cost of redelivery.",
        },
        {
          n: "6.4",
          text: "We cannot be held responsible for delays or added fees stemming from address errors.",
        },
      ],
    },
    {
      title: "Shipping Costs",
      clauses: [
        {
          n: "7.1",
          text: "Shipping charges are calculated automatically at checkout based on destination and package weight.",
        },
        {
          n: "7.2",
          text: "We do not currently offer free shipping, and rates may change at any time without prior notice.",
        },
      ],
    },
    {
      title: "Tracking Your Order",
      clauses: [
        {
          n: "8.1",
          text: "As soon as your order ships, you will receive an email with your DHL tracking number so you can follow your parcel's progress on the DHL website.",
        },
      ],
    },
    {
      title: "Missed Deliveries",
      clauses: [
        {
          n: "9.1",
          text: "Should the first delivery attempt fail, DHL automatically schedules a second attempt.",
        },
        {
          n: "9.2",
          text: "You are also welcome to contact DHL directly to set a new delivery date or arrange pickup from a nearby access point.",
        },
        {
          n: "9.3",
          text: "If a delivery still cannot be completed, the parcel may be returned to us, and redelivery may come with an additional fee.",
        },
      ],
    },
    {
      title: "Damage, Loss & Customs Issues",
      clauses: [
        {
          n: "10.1",
          text: "If your order arrives damaged, or there are any issues with your delivery, contact us right away at sales@onyxhealth.net.",
        },
        {
          n: "10.2",
          text: "For lost parcels or customs holds, we handle each situation individually.",
        },
        {
          n: "10.3",
          text: "Customers are responsible for confirming that the products they order are permitted for import into their country of residence.",
        },
      ],
    },
    {
      title: "Policy Terms",
      clauses: [
        {
          n: "11.1",
          text: "Placing an order with Onyx Research means you accept the terms outlined above.",
        },
        {
          n: "11.2",
          text: "We reserve the right to revise this policy at any time without advance notice.",
        },
      ],
    },
  ],
};

/* ──────────────────────────────────────────────────────────────
   5. Cookies Policy
   ────────────────────────────────────────────────────────────── */
const COOKIES: Policy = {
  title: "Cookies Policy",
  icon: Cookie,
  tagline: "How Onyx Research uses cookies and similar technologies, and how you can manage them.",
  sections: [
    {
      title: "Introduction",
      clauses: [
        {
          n: "1.1",
          text: `This Cookies Policy explains how ${COMPANY} ("Onyx Research") uses cookies and similar technologies.`,
        },
      ],
    },
    {
      title: "What Are Cookies?",
      clauses: [
        {
          n: "2.1",
          text: "Cookies are small files placed on your device when you visit our website.",
        },
        {
          n: "2.2",
          text: "They help improve functionality, security and your overall experience.",
        },
      ],
    },
    {
      title: "Types of Cookies We Use",
      clauses: [
        { n: "3.1", label: "Essential cookies", text: "required for core website functions." },
        {
          n: "3.2",
          label: "Analytical cookies",
          text: "help us understand how the website performs.",
        },
        { n: "3.3", label: "Preference cookies", text: "remember your settings." },
        {
          n: "3.4",
          label: "Third-party cookies",
          text: "may be set by integrated tools such as analytics.",
        },
      ],
    },
    {
      title: "Managing Cookies",
      clauses: [
        { n: "4.1", text: "You can disable cookies through your browser settings." },
        { n: "4.2", text: "Disabling essential cookies may impair how the website works." },
      ],
    },
    {
      title: "Consent",
      clauses: [
        {
          n: "5.1",
          text: "By continuing to use the website, you consent to our use of cookies.",
        },
      ],
    },
  ],
};

/* ──────────────────────────────────────────────────────────────
   6. Accessibility Policy
   ────────────────────────────────────────────────────────────── */
const ACCESSIBILITY: Policy = {
  title: "Accessibility Policy",
  icon: Accessibility,
  tagline:
    "Our commitment to ensuring the Onyx Research website and services are accessible to all users.",
  sections: [
    {
      title: "Statement of Commitment",
      clauses: [
        {
          n: "1.1",
          text: `${COMPANY} is committed to ensuring its website and services are accessible to all users, including those with disabilities.`,
        },
      ],
    },
    {
      title: "Standards and Guidelines",
      clauses: [{ n: "2.1", text: "We aim to conform to the WCAG 2.1 accessibility standards." }],
    },
    {
      title: "Website Features",
      clauses: [
        { n: "3.1", text: "keyboard navigation support;" },
        { n: "3.2", text: "text alternatives for images;" },
        { n: "3.3", text: "compatibility with screen readers;" },
        { n: "3.4", text: "high-contrast, readable design." },
      ],
    },
    {
      title: "Ongoing Improvements",
      clauses: [
        {
          n: "4.1",
          text: "We regularly review accessibility and implement enhancements over time.",
        },
      ],
    },
    {
      title: "Feedback",
      clauses: [{ n: "5.1", text: `You can report accessibility issues to sales@onyxhealth.net` }],
    },
  ],
};

/* ──────────────────────────────────────────────────────────────
   Exports
   ────────────────────────────────────────────────────────────── */
const POLICY_LINKS = [
  { title: "Privacy Policy", to: "/privacy-policy", icon: ShieldCheck },
  { title: "Terms & Conditions", to: "/terms-conditions", icon: FileText },
  { title: "Refund Policy", to: "/refund-policy", icon: RotateCcw },
  { title: "Shipping & Delivery Policy", to: "/shipping-policy", icon: Truck },
  { title: "Cookies Policy", to: "/cookies-policy", icon: Cookie },
  { title: "Accessibility Policy", to: "/accessibility-policy", icon: Accessibility },
];

export function PrivacyPolicy() {
  return <PolicyShell policy={PRIVACY} />;
}
export function TermsConditions() {
  return <PolicyShell policy={TERMS} />;
}
export function RefundPolicy() {
  return <PolicyShell policy={REFUND} />;
}
export function ShippingPolicy() {
  return <PolicyShell policy={SHIPPING} />;
}
export function CookiesPolicy() {
  return <PolicyShell policy={COOKIES} />;
}
export function AccessibilityPolicy() {
  return <PolicyShell policy={ACCESSIBILITY} />;
}
