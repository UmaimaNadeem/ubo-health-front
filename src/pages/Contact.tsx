import { Link } from "react-router-dom";
import { Mail, Sparkles, Send, Phone, Globe } from "lucide-react";
import { LeadForm } from "../components/LeadForm";
import { WHATSAPP_URL, SALES_EMAIL, ENQUIRY_REGIONS } from "../data/contact";

export function Contact() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-[#0a1733] text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-accent/15 blur-[140px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-8 2xl:py-20">
          <nav className="mb-6 text-xs opacity-70">
            <Link to="/" className="hover:text-accent">
              Home
            </Link>{" "}
            / <span className="opacity-90">Contact</span>
          </nav>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Contact
          </span>
          <h1 className="text-3xl font-black leading-tight md:text-5xl">Get in touch</h1>
          <p className="mt-4 max-w-2xl text-base opacity-80 md:text-lg">
            Questions about products, orders, or a wholesale partnership? Send us a message and our
            team will get back to you.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          {/* Left: contact info */}
          <div>
            <h2 className="text-2xl font-black md:text-3xl">Talk to us</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Reach out with any question and we'll point you in the right direction.
            </p>
            <div className="mt-8 space-y-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition hover:border-[#25d366]/50 hover:shadow-md"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#25d366]/10 text-[#25d366] ring-1 ring-inset ring-[#25d366]/20 transition group-hover:bg-[#25d366] group-hover:text-white">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    WhatsApp
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold group-hover:text-[#25d366]">
                    Chat with us
                  </span>
                </span>
              </a>

              <a
                href={`mailto:${SALES_EMAIL}`}
                className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition hover:border-accent/50 hover:shadow-md"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-inset ring-accent/20 transition group-hover:bg-accent group-hover:text-accent-foreground">
                  <Mail className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Email
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold group-hover:text-accent">
                    {SALES_EMAIL}
                  </span>
                </span>
              </a>
            </div>

            {/* Global enquiries: B2B reach, no number shown — WhatsApp card above handles contact */}
            <div className="mt-6 rounded-2xl border bg-secondary p-6">
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
                  <Globe className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Global Enquiries
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold">
                    {ENQUIRY_REGIONS.join(" • ")}
                  </span>
                </span>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                For sales, wholesale, distribution and business enquiries, contact our international
                team.
              </p>

              <p className="mt-4 border-t pt-4 text-xs text-muted-foreground">
                Serving business enquiries across the UK, Europe &amp; Middle East.
              </p>
            </div>

            <p className="mt-6 text-sm font-semibold text-accent md:text-base">
              We respond to all inquiries within 24 hours
            </p>
          </div>

          {/* Right: form card */}
          <div className="rounded-3xl border bg-card p-6 shadow-xl md:p-8">
            <LeadForm
              kind="contact"
              heading="Send us a message"
              submitLabel="Send message"
              submitIcon={<Send className="h-4 w-4" />}
              emailPlaceholder="you@example.com"
              messagePlaceholder="How can we help?"
              success={{
                title: "Message sent",
                body: "Thanks for reaching out. Our team will be in touch within one business day.",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
