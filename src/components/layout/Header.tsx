import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useAuth, useCart } from "../../context/contexts";
import { MegaMenu } from "./MegaMenu";

export function Logo({ className = "" }: { className?: string }) {
  const [useImg, setUseImg] = useState(true);
  return (
    <Link to="/" aria-label="OBU Health" className={`inline-flex items-baseline ${className}`}>
      {useImg ? (
        <img
          src="/obu/logo.svg"
          alt="obu.health"
          onError={() => setUseImg(false)}
          className="h-[clamp(1.6rem,2.2vw,2.6rem)] w-auto"
        />
      ) : (
        <>
          <span className="font-heading text-[clamp(1.75rem,2.35vw,2.75rem)] font-extrabold leading-none tracking-tight">
            obu.
          </span>
          <span className="font-heading text-[clamp(1.35rem,1.8vw,2.1rem)] font-light leading-none">health</span>
          <sup className="ml-0.5 text-[0.5rem] font-light">™</sup>
        </>
      )}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const cart = useCart();
  const auth = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[#e6e6e6] bg-white text-black">
      <div className="mx-auto grid h-[clamp(3.5rem,5.15vw,6.125rem)] w-full max-w-[1544px] grid-cols-3 items-center px-4 sm:px-8 min-[1700px]:px-[10px]">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="justify-self-start"
        >
          {open ? <X className="h-[clamp(1.1rem,1.25vw,1.5rem)] w-[clamp(1.1rem,1.25vw,1.5rem)]" strokeWidth={1.6} /> : <Menu className="h-[clamp(1.1rem,1.25vw,1.5rem)] w-[clamp(1.1rem,1.25vw,1.5rem)]" strokeWidth={1.6} />}
        </button>
        <Logo className="justify-self-center" />
        <div className="flex items-center gap-[clamp(.9rem,1.5vw,1.75rem)] justify-self-end">
          <Link to="/peptides" aria-label="Search">
            <Search className="h-[clamp(1.05rem,1.2vw,1.45rem)] w-[clamp(1.05rem,1.2vw,1.45rem)]" strokeWidth={1.5} />
          </Link>
          <Link to={auth.user ? "/profile" : "/login"} aria-label="Account">
            <User className="h-[clamp(1.05rem,1.2vw,1.45rem)] w-[clamp(1.05rem,1.2vw,1.45rem)]" strokeWidth={1.5} />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative">
            <ShoppingBag className="h-[clamp(1.05rem,1.2vw,1.45rem)] w-[clamp(1.05rem,1.2vw,1.45rem)]" strokeWidth={1.5} />
            {cart.count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-black text-[9px] text-white">
                {cart.count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <MegaMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
