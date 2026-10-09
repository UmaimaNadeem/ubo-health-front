import { Truck, ShieldCheck, BadgeCheck, Factory } from "lucide-react";
import { TrustBadge } from "./TrustBadge";

const ITEMS = [
  { icon: Truck, t: "Fast EU dispatch", s: "Shipped within 24 hours" },
  { icon: ShieldCheck, t: "Verified purity", s: "Third-party tested" },
  { icon: BadgeCheck, t: "Authenticity codes", s: "Check every batch" },
  { icon: Factory, t: "Manufactured in the U.K. & EU", s: "Certified facilities" },
];

export function TrustBar() {
  return (
    <section className="border-b bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-8 sm:gap-6 lg:grid-cols-4">
        {ITEMS.map((f) => (
          <div key={f.t} className="flex justify-start lg:justify-center">
            <TrustBadge icon={f.icon} title={f.t} subtitle={f.s} />
          </div>
        ))}
      </div>
    </section>
  );
}
