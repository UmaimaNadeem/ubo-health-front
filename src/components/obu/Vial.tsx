import { useId } from "react";

type Variant = "blue" | "gold";

const THEME: Record<Variant, { cap: string; capDark: string; capLight: string; label: string; labelDark: string }> = {
  blue: { cap: "#2b3fd0", capDark: "#1a29a0", capLight: "#4a5ef0", label: "#2540d6", labelDark: "#1a2fb0" },
  gold: { cap: "#a67c45", capDark: "#7a5a2c", capLight: "#c49a62", label: "#a97c47", labelDark: "#7d5a2d" },
};

/**
 * Illustrated product vial, viewBox 130x310 (about 0.42 aspect, as in the reference where a
 * 130px-wide bottle shows ~285px above the card edge). Swap for product photography when ready.
 * `id` keeps gradient ids unique when several vials are on the page.
 */
export function ProductVial({
  id,
  variant = "blue",
  label,
  className = "",
}: {
  id: string;
  variant?: Variant;
  label: string;
  className?: string;
}) {
  const t = THEME[variant];
  const uid = `${id}-${useId().replace(/:/g, "")}`;
  const words = label.split(" ");
  const long = words.some((w) => w.length > 10);
  const fs = long ? 13 : 17;
  return (
    <svg viewBox="0 0 130 310" className={className} role="img" aria-label={`${label} vial`}>
      <defs>
        <linearGradient id={`cap-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor={t.capDark} />
          <stop offset="0.45" stopColor={t.capLight} />
          <stop offset="1" stopColor={t.capDark} />
        </linearGradient>
        <linearGradient id={`glass-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#c9d1da" />
          <stop offset="0.3" stopColor="#f6f8fa" />
          <stop offset="0.7" stopColor="#e4e9ee" />
          <stop offset="1" stopColor="#b7c0ca" />
        </linearGradient>
        <linearGradient id={`silver-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#aab3bd" />
          <stop offset="0.4" stopColor="#f2f4f6" />
          <stop offset="1" stopColor="#9aa4af" />
        </linearGradient>
        <linearGradient id={`lab-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor={t.labelDark} />
          <stop offset="0.45" stopColor={t.label} />
          <stop offset="1" stopColor={t.labelDark} />
        </linearGradient>
      </defs>
      {/* cap */}
      <rect x="0" y="2" width="130" height="42" rx="11" fill={`url(#cap-${uid})`} />
      <ellipse cx="65" cy="6" rx="62" ry="7" fill={t.capLight} opacity="0.85" />
      <text x="65" y="30" textAnchor="middle" fontSize="19" fontWeight="700" fill={t.capDark} opacity="0.55" fontFamily="Outfit, sans-serif">
        obu.
      </text>
      {/* collar */}
      <rect x="6" y="44" width="118" height="18" rx="4" fill={`url(#silver-${uid})`} />
      {/* glass body */}
      <path d="M14 62h102v38c8 8 12 14 12 24v186H2V124c0-10 4-16 12-24z" fill={`url(#glass-${uid})`} />
      <rect x="22" y="68" width="86" height="28" rx="6" fill="#fff" opacity="0.35" />
      {/* white label */}
      <rect x="2" y="136" width="126" height="62" fill="#fff" />
      <text x="65" y="174" textAnchor="middle" fontSize="17" fontFamily="Outfit, sans-serif" fill="#111">
        <tspan fontWeight="700">obu.</tspan>
        <tspan fontWeight="300" fontSize="12">
          health
        </tspan>
      </text>
      {/* colored label */}
      <rect x="2" y="198" width="126" height="112" fill={`url(#lab-${uid})`} />
      {words.slice(0, 3).map((w, i) => (
        <text key={i} x="14" y={230 + i * (fs + 3)} fontSize={fs} fontWeight="700" fill="#fff" fontFamily="Outfit, sans-serif">
          {w}
        </text>
      ))}
      {/* glass highlight */}
      <rect x="12" y="112" width="9" height="190" rx="4" fill="#fff" opacity="0.3" />
    </svg>
  );
}
