import { useEffect, useMemo, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "../lib/utils";
import { PHONE_COUNTRIES, DEFAULT_PHONE_COUNTRY, type PhoneCountry } from "../data/phoneCountries";

/**
 * A phone-number field with an inline country-code picker (flag + dial code).
 * The parent stores a single string. On change we emit "<dial> <national>"
 * (e.g. "+44 7911 123456").
 */
type Variant = "default" | "light" | "dark";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  placeholder?: string;
  invalid?: boolean;
  autoComplete?: string;
  className?: string;
  variant?: Variant;
}

// Longest dial codes first so "+1268" wins over "+1", "+379" over "+39", etc.
const BY_DIAL_LENGTH = [...PHONE_COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);

const combine = (country: PhoneCountry, national: string) => {
  const n = national.trim();
  return n ? `${country.dial} ${n}` : "";
};

const splitPhone = (value: string): { country: PhoneCountry; national: string } => {
  const v = (value || "").trim();
  if (v.startsWith("+")) {
    const compact = v.replace(/[\s\-()]/g, "");
    const match = BY_DIAL_LENGTH.find((c) => compact.startsWith(c.dial));
    if (match) {
      return { country: match, national: compact.slice(match.dial.length) };
    }
  }
  return { country: DEFAULT_PHONE_COUNTRY, national: v.replace(/^\+/, "") };
};

export function PhoneInput({
  value,
  onChange,
  id,
  name,
  placeholder = "Phone number",
  invalid,
  autoComplete = "tel",
  className,
  variant = "default",
}: PhoneInputProps) {
  // Local state so the flag choice sticks even when dial codes overlap
  // (e.g. +1 for the US and Canada). We initialise from the incoming value.
  const [country, setCountry] = useState<PhoneCountry>(() => splitPhone(value).country);
  const [national, setNational] = useState<string>(() => splitPhone(value).national);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);
  const nationalRef = useRef<HTMLInputElement>(null);

  // Re-sync if the parent replaces the value externally (prefill / form reset).
  useEffect(() => {
    if (value !== combine(country, national)) {
      const p = splitPhone(value);
      setCountry(p.country);
      setNational(p.national);
    }
    // Only react to external value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const emit = (c: PhoneCountry, n: string) => {
    setCountry(c);
    setNational(n);
    onChange(combine(c, n));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PHONE_COUNTRIES;
    const digits = q.replace(/[^\d+]/g, "");
    return PHONE_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso2.includes(q) ||
        (digits && c.dial.includes(digits)),
    );
  }, [query]);

  const selectCountry = (c: PhoneCountry) => {
    emit(c, national);
    setOpen(false);
    setQuery("");
    // Return focus to the number field for a smooth flow.
    requestAnimationFrame(() => nationalRef.current?.focus());
  };

  const variantWrap: Record<Variant, string> = {
    default: "border bg-background text-foreground",
    light: "border border-white/25 bg-white/10 text-white",
    dark: "border bg-white text-foreground",
  };

  return (
    <div
      className={cn(
        "flex w-full items-stretch overflow-hidden rounded-xl text-sm transition",
        "focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20",
        variantWrap[variant],
        invalid && "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20",
        className,
      )}
    >
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label={`Country code: ${country.name} (${country.dial})`}
            className="flex shrink-0 items-center gap-1.5 border-r border-inherit px-3 py-3 outline-none transition hover:bg-black/[0.03] focus-visible:bg-black/[0.03]"
          >
            <span className={`fi fi-${country.iso2} h-4 w-5 shrink-0 rounded-[2px]`} />
            <span className="font-medium tabular-nums">{country.dial}</span>
            <ChevronDown className="h-4 w-4 opacity-60" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              searchRef.current?.focus();
            }}
            className="z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl"
          >
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <Search className="h-4 w-4 shrink-0 opacity-50" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filtered[0]) {
                    e.preventDefault();
                    selectCountry(filtered[0]);
                  }
                }}
                placeholder="Search country or code…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No matches
                </li>
              )}
              {filtered.map((c) => {
                const selected = c.iso2 === country.iso2;
                return (
                  <li key={c.iso2}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => selectCountry(c)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-accent/10",
                        selected && "bg-accent/10",
                      )}
                    >
                      <span className={`fi fi-${c.iso2} h-4 w-5 shrink-0 rounded-[2px]`} />
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="tabular-nums text-muted-foreground">{c.dial}</span>
                      {selected && <Check className="h-4 w-4 shrink-0 text-accent" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <input
        ref={nationalRef}
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        value={national}
        onChange={(e) => emit(country, e.target.value)}
        placeholder={placeholder}
        className="w-full flex-1 bg-transparent px-3 py-3 outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
