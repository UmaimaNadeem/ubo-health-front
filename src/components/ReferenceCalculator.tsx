import { useState } from "react";
import { Info, Syringe } from "lucide-react";

// Volume released by one click of the pen. A fixed property of the device —
// deliberately NOT derived from the cartridge volume or a unit count.
const CLICK_VOLUME_ML = 0.01;

/** Blank, NaN and non-positive values all read as "not entered". */
function parse(value: string): number | null {
  const n = parseFloat(value);
  return Number.isNaN(n) || n <= 0 ? null : n;
}

function Field({
  label,
  unit,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-primary-foreground/60">
        {label}
      </label>
      <div className="mt-2 flex items-center rounded-lg border border-white/15 bg-white/5 transition focus-within:border-accent">
        <input
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2.5 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/35 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="pr-3 text-xs font-semibold text-primary-foreground/50">{unit}</span>
      </div>
    </div>
  );
}

export function ReferenceCalculator() {
  const [massInput, setMassInput] = useState("");
  const [volumeInput, setVolumeInput] = useState("");
  const [targetInput, setTargetInput] = useState("");

  const mass = parse(massInput);
  const volume = parse(volumeInput);
  const target = parse(targetInput);

  const hasAll = mass !== null && volume !== null && target !== null;
  const dispensingVolume = hasAll ? (target * volume) / mass : null;

  const outputs = [
    {
      label: "Total mass present",
      value: mass !== null ? `${mass.toFixed(2)} mg` : "—",
    },
    {
      label: "Calculated concentration",
      value: mass !== null && volume !== null ? `${(mass / volume).toFixed(2)} mg/mL` : "—",
    },
    {
      label: "Calculated microgram value (lab reference)",
      value: target !== null ? `${Math.round(target * 1000)} mcg` : "—",
    },
    {
      label: "Dispensing volume required",
      value: dispensingVolume !== null ? `${dispensingVolume.toFixed(3)} mL` : "—",
    },
    {
      label: "Approx. device increments (laboratory dispensing)",
      // round(), not floor(): dispensing volumes rarely divide evenly into
      // 0.01 mL, and a count of 66.67 should read 67 rather than 66.
      value:
        dispensingVolume !== null
          ? `${Math.round(dispensingVolume / CLICK_VOLUME_ML)} clicks`
          : "—",
    },
  ];

  const overCapacity = mass !== null && target !== null && target > mass;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 pb-16">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* Input panel */}
        <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Syringe className="h-4 w-4" />
            </span>
            <h3 className="text-base font-bold">Click-Dial Pen</h3>
          </div>

          <div className="my-5 h-px bg-white/10" />

          <div className="space-y-4">
            <Field
              label="Total mass within sealed unit"
              unit="mg"
              placeholder="e.g. 100"
              value={massInput}
              onChange={setMassInput}
            />
            <Field
              label="Total solution volume"
              unit="mL"
              placeholder="e.g. 3"
              value={volumeInput}
              onChange={setVolumeInput}
            />
            <Field
              label="Target research quantity"
              unit="mg"
              placeholder="e.g. 2"
              value={targetInput}
              onChange={setTargetInput}
            />
          </div>

          {overCapacity && (
            <p className="mt-4 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-primary-foreground/80">
              The target quantity exceeds the total mass held in the cartridge. Check the values
              entered.
            </p>
          )}

          <div className="my-5 h-px bg-white/10" />

          <p className="text-[11px] font-bold uppercase tracking-wider text-primary-foreground/60">
            Calculated output
          </p>
          <dl className="mt-3">
            {outputs.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3 last:border-b-0"
              >
                <dt className="text-sm text-primary-foreground/85">{row.label}</dt>
                <dd className="shrink-0 text-sm font-bold tabular-nums">{row.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 text-[11px] leading-relaxed text-primary-foreground/45">
            For research use only. Not for human or veterinary use. Figures support research
            planning and analytical preparation, and must not be used to derive clinical or
            therapeutic quantities.
          </p>
        </div>

        {/* Explanatory panel */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Research Use Only
          </p>
          <h2 className="mt-2 text-3xl font-black md:text-4xl">Analytical Reference Calculator</h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A planning aid for laboratory teams measuring peptide quantities held within a
            pre-filled click-dial pen. Enter the values for your sealed cartridge and the tool
            returns the solution concentration, the volume dispensed, and the number of precise
            increments to dial.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The calculator exists to keep analytical preparation consistent across experimental
            workflows, offering a quick way to derive mass to volume relationships and approximate
            microgram values for research planning. Every figure it displays is indicative, and none
            of it constitutes guidance for administration, clinical use, or therapeutic dosing.
          </p>

          <div className="mt-6 rounded-xl border bg-card p-6">
            <h3 className="text-lg font-bold">For click-dial pen calculations</h3>
            <p className="mt-1 text-sm text-foreground">
              (Pre-filled sealed containment unit delivering 300 precise clicks for research use.)
            </p>

            <ol className="mt-5 space-y-3">
              {[
                "Enter the total mass contained within the sealed cartridge, in milligrams.",
                "Enter the total solution volume, in millilitres.",
                "Enter the target research quantity required for measurement, in milligrams.",
              ].map((step, i) => (
                <li key={step} className="flex gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-bold text-accent">
                    {i + 1}
                  </span>
                  <span className="text-foreground/85">{step}</span>
                </li>
              ))}
            </ol>

            <div className="my-5 h-px bg-border" />

            <p className="text-sm leading-relaxed text-muted-foreground">
              The calculator outputs the total mass present, the corresponding solution
              concentration, the equivalent microgram value, the dispensing volume required, and the
              approximate device increments for laboratory dispensing.
            </p>
          </div>

          <div className="mt-6 flex gap-3 border-l-4 border-accent bg-secondary p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p className="text-sm leading-relaxed">
              <span className="font-bold">Important.</span> All values are indicative and provided
              strictly for laboratory planning and analytical reference. This tool must not be used
              to inform clinical, human, or veterinary dosing, administration, or any therapeutic
              decision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
