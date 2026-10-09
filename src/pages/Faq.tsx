import { useState } from "react";
import { Page } from "./PageShell";

export function FAQ() {
  const items = [
    {
      q: "Are your peptides for human use?",
      a: "No. All products are sold strictly for research use only.",
    },
    {
      q: "Where do you ship?",
      a: "We ship discreetly across Europe with tracking on every order.",
    },
    {
      q: "What is the purity?",
      a: "At least 99% verified by third-party HPLC and mass-spec testing.",
    },
    {
      q: "How do I store peptides?",
      a: "Lyophilized peptides keep best at -20C; reconstituted at 2-8C and used promptly.",
    },
    {
      q: "What payment methods do you accept?",
      a: "Cards, bank transfers, and crypto. See Payment & Delivery for details.",
    },
    {
      q: "How long does shipping take?",
      a: "EU: 2-5 business days. International: 5-14 business days.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Page title="Frequently Asked Questions" subtitle="Answers to the most common questions.">
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl border bg-card">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold"
            >
              {it.q}
              <span className="text-accent">{open === i ? "-" : "+"}</span>
            </button>
            {open === i && <div className="px-5 pb-5 text-sm text-muted-foreground">{it.a}</div>}
          </div>
        ))}
      </div>
    </Page>
  );
}
