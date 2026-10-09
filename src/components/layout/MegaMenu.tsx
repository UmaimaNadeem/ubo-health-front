import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Instagram, Youtube } from "lucide-react";
import { ProductVial } from "../obu/Vial";

const EASE = [0.22, 1, 0.36, 1] as const;

const TREATMENTS = [
  { to: "/product/tirzepatide", label: "Tirzepatide" },
  { to: "/product/semaglutide", label: "Semaglutide GLP-1" },
  { to: "/product/nad-injection", label: "NAD+ Injection" },
  { to: "/product/sermorelin", label: "Sermorelin" },
];

const CONTACT = [
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact Us" },
];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
    </svg>
  );
}

// Fill these in with your real profiles.
const SOCIALS = [
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "TikTok", href: "#", Icon: TikTokIcon },
  { label: "X", href: "#", Icon: XIcon },
  { label: "Pinterest", href: "#", Icon: PinterestIcon },
  { label: "YouTube", href: "#", Icon: Youtube },
];

// Position of each bottle in the right pane, as a % of that pane (measured from the reference).
const BOTTLES = [
  { id: "m-tirz", variant: "blue" as const, label: "TIRZEPATIDE GLP-1/GIP", left: 29.4, top: 23.2, w: 11.6, z: 1, delay: 0.35 },
  { id: "m-nad", variant: "gold" as const, label: "NAD+", left: 57.5, top: 23, w: 11, z: 1, delay: 0.45 },
  { id: "m-sema", variant: "blue" as const, label: "SEMAGLUTIDE GLP-1", left: 20.6, top: 35.6, w: 17, z: 2, delay: 0.55 },
  { id: "m-serm", variant: "gold" as const, label: "SERMORELIN", left: 63.1, top: 35.9, w: 16.4, z: 2, delay: 0.65 },
];

const labelClass = "text-[clamp(.8rem,.9vw,1.1rem)] tracking-wide text-black/45";
const linkClass =
  "ml-[clamp(.75rem,1.1vw,1.3rem)] block text-[clamp(1.25rem,1.45vw,1.75rem)] tracking-wide text-black transition hover:translate-x-1 hover:text-[#2b52e6]";

export function MegaMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 -z-10 bg-white/60 backdrop-blur-sm"
          />
          <div key="panel" className="absolute inset-x-0 top-full">
            <div className="mx-auto w-full max-w-[1544px] px-4 sm:px-8 min-[1700px]:px-0">
              <motion.nav
                aria-label="Menu"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                exit={{ clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: 0.65, ease: EASE }}
                className="grid h-[clamp(26rem,calc(100svh-7rem),52rem)] overflow-hidden rounded-b-[clamp(2rem,3.4vw,4rem)] md:grid-cols-2"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 70% at 22% 58%,#a8b7f8 0%,rgba(168,183,248,0) 70%),linear-gradient(100deg,#e3e7fd 0%,#cfd5f5 45%,#dcdaee 66%,#f6e8d8 100%)",
                }}
              >
                {/* left: links */}
                <div className="flex flex-col justify-between overflow-y-auto p-[clamp(1.5rem,2.2vw,2.6rem)]">
                  <div>
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className={labelClass}
                    >
                      Treatments
                    </motion.p>
                    <ul className="mt-[clamp(.8rem,1.4vw,1.7rem)] space-y-[clamp(.8rem,1.55vw,1.9rem)]">
                      {TREATMENTS.map((l, i) => (
                        <motion.li
                          key={l.label}
                          initial={{ opacity: 0, x: -24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25 + i * 0.07, duration: 0.55, ease: EASE }}
                        >
                          <Link to={l.to} onClick={onClose} className={linkClass}>
                            {l.label}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>

                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className={`${labelClass} mt-[clamp(2rem,3.6vw,4.4rem)]`}
                    >
                      Contact
                    </motion.p>
                    <ul className="mt-[clamp(.8rem,1.4vw,1.7rem)] space-y-[clamp(.8rem,1.55vw,1.9rem)]">
                      {CONTACT.map((l, i) => (
                        <motion.li
                          key={l.label}
                          initial={{ opacity: 0, x: -24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.55 + i * 0.07, duration: 0.55, ease: EASE }}
                        >
                          <Link to={l.to} onClick={onClose} className={linkClass}>
                            {l.label}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mt-8 flex items-center gap-[clamp(.6rem,.85vw,1rem)]"
                  >
                    {SOCIALS.map(({ label, href, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="grid h-[clamp(2.4rem,2.55vw,3.1rem)] w-[clamp(2.4rem,2.55vw,3.1rem)] place-items-center rounded-full bg-white/40 text-white transition hover:scale-110 hover:bg-white/70 hover:text-[#2b52e6]"
                      >
                        <Icon className="h-[46%] w-[46%]" />
                      </a>
                    ))}
                  </motion.div>
                </div>

                {/* right: bottles */}
                <div className="relative hidden border-l border-black/10 md:block">
                  {BOTTLES.map((b) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 70 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: b.delay, duration: 0.9, ease: EASE }}
                      className="absolute"
                      style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.w}%`, zIndex: b.z }}
                    >
                      <ProductVial
                        id={b.id}
                        variant={b.variant}
                        label={b.label}
                        className="block h-auto w-full drop-shadow-[0_22px_22px_rgba(40,40,80,.28)]"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.nav>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
