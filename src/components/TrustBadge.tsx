import type { LucideIcon } from "lucide-react";

export type TrustBadgeProps = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  /** "light" for use on light/card backgrounds, "dark" for use on dark hero sections. */
  variant?: "light" | "dark";
};

export function TrustBadge({ icon: Icon, title, subtitle, variant = "light" }: TrustBadgeProps) {
  const dark = variant === "dark";
  return (
    <div className="flex items-center gap-3">
      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${
          dark ? "bg-white/10 text-accent" : "bg-secondary text-primary"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className={`text-sm font-bold ${dark ? "text-white" : ""}`}>{title}</div>
        <div className={`text-xs ${dark ? "text-white/70" : "text-muted-foreground"}`}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}
