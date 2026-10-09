import { useMemo, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "../lib/utils";
import { PHONE_COUNTRIES } from "../data/phoneCountries";

/**
 * A country picker that shows a flag next to each name and is searchable.
 * It stores the plain country **name** string (e.g. "United Kingdom"), so it
 * is a drop-in replacement for the previous <select> and the backend contract
 * is unchanged.
 */
type Variant = "default" | "light" | "dark";

interface CountrySelectProps {
  value: string;
  onChange: (name: string) => void;
  id?: string;
  name?: string;
  placeholder?: string;
  invalid?: boolean;
  className?: string;
  variant?: Variant;
}

export function CountrySelect({
  value,
  onChange,
  id,
  name,
  placeholder = "Select a country…",
  invalid,
  className,
  variant = "default",
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => PHONE_COUNTRIES.find((c) => c.name === value),
    [value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PHONE_COUNTRIES;
    return PHONE_COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.iso2.includes(q),
    );
  }, [query]);

  const pick = (countryName: string) => {
    onChange(countryName);
    setOpen(false);
    setQuery("");
  };

  const variantTrigger: Record<Variant, string> = {
    default: "border bg-background text-foreground",
    light: "border border-white/25 bg-white/10 text-white",
    dark: "border bg-white text-foreground",
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id={id}
          name={name}
          aria-invalid={invalid || undefined}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm outline-none transition",
            "focus:border-accent focus:ring-2 focus:ring-accent/20",
            variantTrigger[variant],
            invalid && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className,
          )}
        >
          {selected ? (
            <>
              <span className={`fi fi-${selected.iso2} h-4 w-5 shrink-0 rounded-[2px]`} />
              <span className="flex-1 truncate">{selected.name}</span>
            </>
          ) : (
            <span className="flex-1 truncate text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
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
          className="z-50 w-[var(--radix-popover-trigger-width)] min-w-[16rem] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl"
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
                  pick(filtered[0].name);
                }
              }}
              placeholder="Search country…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
            {filtered.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">No matches</li>
            )}
            {filtered.map((c) => {
              const isSel = c.name === value;
              return (
                <li key={c.iso2}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSel}
                    onClick={() => pick(c.name)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-accent/10",
                      isSel && "bg-accent/10",
                    )}
                  >
                    <span className={`fi fi-${c.iso2} h-4 w-5 shrink-0 rounded-[2px]`} />
                    <span className="flex-1 truncate">{c.name}</span>
                    {isSel && <Check className="h-4 w-4 shrink-0 text-accent" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
