import { Link } from "react-router-dom";
import {
  ArrowRight,
  Box,
  Check,
  FlaskConical,
  Globe2,
  Headphones,
  Mail,
  PackageCheck,
  Phone,
  ShieldCheck,
  Tag,
  Truck,
  UserRound,
} from "lucide-react";
import { WholesaleApplicationForm } from "../components/WholesaleApplicationForm";
import { TrustBar } from "../components/TrustBar";
import { SALES_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_URL } from "../data/contact";

const BENEFITS = [
  {
    icon: Tag,
    title: "Trade Pricing",
    body: "Competitive wholesale pricing for approved partners.",
  },
  {
    icon: Truck,
    title: "Priority Dispatch",
    body: "Fast and reliable shipping with priority handling.",
  },
  {
    icon: UserRound,
    title: "Dedicated Support",
    body: "A direct account contact to support your business.",
  },
];

const PARTNER_OPTIONS = [
  {
    icon: Box,
    title: "ONYX branded",
    body: "Ready-presented range",
  },
  {
    icon: Tag,
    title: "White label",
    body: "Your approved identity",
  },
  {
    icon: ShieldCheck,
    title: "Cartridge-only",
    body: "Flexible B2B supply",
  },
];

const WHO_CAN_APPLY = [
  "Registered businesses & companies",
  "Health clinics & wellness centres",
  "Distributors & resellers",
  "Online stores & eCommerce businesses",
  "International partners welcome",
];

export function WholesaleApplication() {
  return (
    <div className="bg-[#f8fbfd] text-primary">
      <section className="relative overflow-hidden border-b border-sky-100 bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-28 bottom-[-8rem] h-72 w-72 rounded-full border-[26px] border-sky-50"
        />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 md:py-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-10 xl:px-8">
          <div className="pt-3 lg:sticky lg:top-24 lg:pt-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
              Wholesale application
            </p>
            <h1 className="mt-4 max-w-lg text-4xl font-black leading-[1.04] tracking-tight text-primary sm:text-5xl">
              Apply for an ONYX <span className="text-accent">Wholesale Account</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 md:text-base">
              Partner with ONYX Health and unlock trade pricing, priority dispatch and dedicated
              support designed for your business.
            </p>

            <div className="mt-8 space-y-5">
              {BENEFITS.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky-50 text-accent">
                    <benefit.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-black text-primary">{benefit.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{benefit.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex gap-4 border-t border-slate-100 pt-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center text-primary">
                <ShieldCheck className="h-7 w-7" />
              </span>
              <div>
                <h2 className="text-sm font-black">Trusted. Tested. Transparent.</h2>
                <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                  ONYX products are independently tested and supported by clear batch documentation.
                </p>
              </div>
            </div>
          </div>

          <div
            id="apply"
            className="relative z-10 rounded-[26px] border border-sky-100 bg-white p-5 shadow-[0_18px_55px_rgba(9,48,88,0.08)] sm:p-7 lg:p-8"
          >
            <WholesaleApplicationForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 md:py-10 xl:px-8">
        <div className="relative overflow-hidden rounded-[26px] border border-sky-100 bg-white p-6 shadow-[0_16px_45px_rgba(9,48,88,0.05)] md:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full border-[24px] border-sky-50"
          />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
              Partner programme
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-primary md:text-3xl">
              One enquiry. Three ways to work with ONYX.
            </h2>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {PARTNER_OPTIONS.map((option) => (
                <div
                  key={option.title}
                  className="rounded-2xl border border-sky-100 bg-[#fbfdff] p-5"
                >
                  <option.icon className="h-7 w-7 text-accent" />
                  <h3 className="mt-4 text-lg font-black">{option.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{option.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 md:pb-14 xl:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-white p-6">
            <h2 className="text-lg font-black">Who Can Apply?</h2>
            <div className="mt-3 h-0.5 w-7 bg-accent" />
            <ul className="mt-5 space-y-3">
              {WHO_CAN_APPLY.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50/50 p-4 text-xs leading-5 text-slate-600">
              All applications are reviewed to ensure the best partnership fit for both sides.
            </div>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-white p-6">
            <h2 className="text-lg font-black">Our Commitment</h2>
            <div className="mt-3 h-0.5 w-7 bg-accent" />
            <p className="mt-5 text-sm leading-6 text-slate-600">
              ONYX is focused on long-term B2B partnerships built around quality, transparency and
              dependable service.
            </p>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <FlaskConical className="h-5 w-5 text-accent" /> Third-Party Lab Tested
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-accent" /> High Quality & Consistency
              </div>
              <div className="flex items-center gap-3">
                <PackageCheck className="h-5 w-5 text-accent" /> Compliance & Safety Focused
              </div>
            </div>
            <Link
              to="/about"
              className="mt-7 inline-flex items-center gap-2 rounded-xl border border-accent px-5 py-3 text-sm font-bold text-accent transition hover:bg-sky-50"
            >
              Learn More About ONYX <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-white p-6">
            <h2 className="text-lg font-black">Need Help?</h2>
            <div className="mt-3 h-0.5 w-7 bg-accent" />
            <p className="mt-5 text-sm leading-6 text-slate-600">
              If you have questions about the wholesale programme or need assistance with your
              application, our team can help.
            </p>
            <div className="mt-5 space-y-4 text-sm font-semibold text-primary">
              <a
                href={`mailto:${SALES_EMAIL}`}
                className="flex items-center gap-3 hover:text-accent"
              >
                <Mail className="h-5 w-5 text-accent" /> {SALES_EMAIL}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-accent"
              >
                <Phone className="h-5 w-5 text-accent" /> {WHATSAPP_DISPLAY}
              </a>
              <div className="flex items-center gap-3">
                <Globe2 className="h-5 w-5 text-accent" /> Global B2B enquiries
              </div>
            </div>
            <a
              href={`mailto:${SALES_EMAIL}`}
              className="mt-7 inline-flex items-center gap-2 rounded-xl border border-accent px-5 py-3 text-sm font-bold text-accent transition hover:bg-sky-50"
            >
              Contact Us <Headphones className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <TrustBar />
    </div>
  );
}
