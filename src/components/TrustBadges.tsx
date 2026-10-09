import type { ReactNode } from "react";
import { Truck, ShieldCheck, Headset } from "lucide-react";

type Badge = { icon: typeof Truck; title: string; body: ReactNode };

const BADGES: Badge[] = [
  {
    icon: Truck,
    title: "Fast Shipping",
    body: "Every order is dispatched promptly and sent with fully tracked express delivery.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assured Products",
    body: "Each product is put through rigorous quality testing, so you consistently receive compounds of the highest standard.",
  },
  {
    icon: Headset,
    title: "Customer Service",
    body: (
      <>
        Have a question? Our team is always happy to help. Just reach out at{" "}
        <a href="mailto:sales@onyxhealth.net" className="font-medium text-accent hover:underline">
          sales@onyxhealth.net
        </a>{" "}
        and we'll get you whatever you need.
      </>
    ),
  },
];

export function TrustBadges({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-lg font-bold">Why Customers Trust ONYX Research</h3>
      <ul className="mt-5 space-y-5">
        {BADGES.map((b) => (
          <li key={b.title} className="flex gap-3">
            <b.icon className="h-7 w-7 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
            <div>
              <div className="text-sm font-bold">{b.title}</div>
              <p className="mt-0.5 text-sm text-muted-foreground">{b.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
