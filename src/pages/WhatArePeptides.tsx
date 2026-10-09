import { Seo } from "../components/Seo";

export function WhatArePeptides() {
  const sections = [
    {
      title: "How peptides work",
      body: "Peptides bind to specific receptors on cell surfaces, triggering precise intracellular signals that adjust gene expression, enzyme activity, and hormone production. Because each peptide-receptor interaction is highly selective, even trace amounts of the right molecule can produce a measurable biological response, making peptides uniquely powerful tools in modern research.",
    },
    {
      title: "Where peptides come from",
      body: "While some peptides are isolated from natural tissue, the overwhelming majority used in laboratories today are synthesised via solid-phase peptide synthesis (SPPS). This technique builds the chain one amino acid at a time, enabling purity verification at every step and allowing researchers to explore sequences that do not exist in nature.",
    },
    {
      title: "Key research areas",
      body: "Peptide research spans metabolic regulation, tissue repair, immune modulation, growth signalling, mood and cognition, sleep physiology, and longevity science. New candidate molecules are evaluated every year, making this one of the most dynamic frontiers in pre-clinical research.",
    },
    {
      title: "Why purity defines results",
      body: "Impurities or truncated sequences alter in-vitro behaviour and undermine reproducibility. Every ONYX Research batch is independently verified by third-party laboratories using HPLC and mass spectrometry, with a reported purity of at least 99%. Lyophilised peptides should be stored frozen, reconstituted with a sterile solvent, and used within the manufacturer's recommended window.",
    },
    {
      title: "Authenticating your batch",
      body: "Every vial ships with a unique authentication code printed on the label. Enter it on our Check Code page to view the independently verified purity figure and the exact date of testing giving you complete confidence in every experiment.",
    },
  ];

  const stats = [
    { value: "≥99%", label: "Verified purity" },
    { value: "HPLC", label: "Third-party tested" },
    { value: "100+", label: "Peptide SKUs" },
    { value: "EU", label: "Shipped worldwide" },
  ];

  return (
    <div>
      <Seo
        title="What Are Peptides? | ONYX Research"
        description="An educational overview of peptide research: receptor signalling, synthesis, purity verification, and batch authentication."
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-[#0a1733] text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 py-8 2xl:py-28">
          <span className="mb-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            Science
          </span>
          <h1 className="text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
            What are peptides?
          </h1>
          <p className="mt-5 text-base opacity-80 md:text-lg">
            Peptides are short amino acid chains. It is the body's most precise signalling
            molecules. Smaller than proteins, they carry targeted biological messages that influence
            everything from metabolism to tissue repair.
          </p>
          <p className="mt-3  text-base opacity-70 md:text-lg">
            The human body produces hundreds of peptides naturally: insulin, oxytocin,
            growth-hormone releasing hormone, and countless neuropeptides. Each one instructs
            specific cells to grow, recover, release hormones, or initiate metabolic processes.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b bg-card">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-border md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center bg-card px-6 py-8 text-center">
              <span className="text-3xl font-black text-accent">{s.value}</span>
              <span className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Content sections */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="space-y-0 divide-y">
          {sections.map((s, i) => (
            <div key={i} className="grid gap-6 py-12 md:grid-cols-[1fr_2fr]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  0{i + 1}
                </span>
                <h2 className="mt-2 text-xl font-black leading-snug md:text-2xl">{s.title}</h2>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Notice banner */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="rounded-2xl border border-accent/30 bg-card p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold">Research Use Only</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  All products listed on this website are intended strictly for in-vitro laboratory
                  research. They are not approved for human consumption, food use, cosmetic use,
                  veterinary use, or any form of in-vivo administration. By placing an order you
                  confirm that you are a qualified researcher and that all material will be handled
                  exclusively in a controlled laboratory environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
