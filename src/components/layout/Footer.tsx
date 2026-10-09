import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const COLS = [
  {
    title: "Categories",
    links: [
      { to: "/peptides", label: "Weight Loss" },
      { to: "/peptides", label: "Longevity" },
      { to: "/peptides", label: "Muscle Support" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { to: "/faq", label: "FAQ" },
      { to: "/contact", label: "Contact Us" },
      { to: "/profile", label: "My Account" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/terms-conditions", label: "Terms of Use" },
      { to: "/privacy-policy", label: "Privacy Policy" },
      { to: "/privacy-policy", label: "HIPAA Notice" },
      { to: "/refund-policy", label: "Returns & Refunds" },
      { to: "/privacy-policy", label: "CCPA Opt-Out" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden rounded-t-[clamp(1.75rem,2.5vw,3rem)] text-white"
      style={{
        background:
          "radial-gradient(ellipse at 85% 95%,#d9a76a 0%,#2b3a8f 28%,transparent 60%),linear-gradient(180deg,#000 0%,#05060f 60%,#0b1233 100%)",
      }}
    >
      <div className="mx-auto flex min-h-[clamp(34rem,50vw,60rem)] w-full max-w-[1544px] flex-col justify-between px-4 pb-10 pt-[clamp(3rem,5.5vw,6.5rem)] sm:px-8 min-[1700px]:px-0"><div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="ml-auto flex max-w-[clamp(15rem,18vw,22rem)] items-center border-b border-white/30 pb-3"
        >
          <input
            type="email"
            required
            placeholder="Your email"
            className="min-w-0 flex-1 bg-transparent text-[clamp(.8rem,.85vw,1rem)] outline-none placeholder:text-white/50"
          />
          <button className="flex items-center gap-1 text-[clamp(.75rem,.8vw,.95rem)] text-white/80 transition hover:text-white">
            Subscribe <ArrowRight className="h-3 w-3" />
          </button>
        </form>

        <div className="mt-[clamp(3rem,6vw,7rem)] grid gap-10 text-[clamp(.85rem,.9vw,1.05rem)] sm:grid-cols-2 lg:grid-cols-4">
          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="mb-5 text-[clamp(.75rem,.8vw,.95rem)] text-white/50">{c.title}</h4>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="transition hover:text-white/70">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="mb-5 text-[clamp(.75rem,.8vw,.95rem)] text-white/50">Contact Us</h4>
            <address className="space-y-3 not-italic">
              <p>OBU Health LLC</p>
              <p>10845 Griffith Peak Dr. Ste 200,</p>
              <p>Las Vegas, NV 89135</p>
              <p>
                Email:{" "}
                <a href="mailto:support@obuhealth.com" className="hover:text-white/70">
                  support@obuhealth.com
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href="tel:+18335738604" className="hover:text-white/70">
                  +1 833 573 8604
                </a>
              </p>
            </address>
          </div>
        </div>

        </div>
        <div className="mt-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[64rem] text-[clamp(.65rem,.65vw,.8rem)] leading-relaxed text-white/55">
            <p className="mb-2 text-[clamp(.75rem,.8vw,.95rem)] text-white/80">© {new Date().getFullYear()} OBU Health. All rights reserved.</p>
            <p>
              The statements on this page have not been evaluated by the U.S. Food and Drug Administration. This
              product is not intended to diagnose, treat, cure, or prevent any disease. Prescription products require
              an online evaluation by a licensed medical provider. Treatment is not guaranteed and is determined by the
              provider based on your individual medical profile. Results may differ from images shown.
            </p>
          </div>
          <Link
            to="/login"
            className="self-start rounded-full bg-white/15 px-6 py-2.5 text-[clamp(.8rem,.85vw,1rem)] backdrop-blur transition hover:bg-white/25 lg:self-auto"
          >
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
