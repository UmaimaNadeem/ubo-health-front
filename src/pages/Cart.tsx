import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/contexts";
import { ApplicationStatusBanner, useApplicationStatus } from "../components/ApplicationStatusBanner";
import Price from "../components/Price";

export default function Cart() {
  const { items, setQty, remove, total, clear } = useCart();
  const applicationStatus = useApplicationStatus();
  const canCheckout = !applicationStatus;
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <ApplicationStatusBanner />
        <h1 className="text-3xl font-black">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our catalog and find what your research needs.
        </p>
        <Link
          to="/peptides"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          Shop peptides
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <ApplicationStatusBanner />
      <h1 className="mb-6 text-3xl font-black">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((d) => (
            <div
              key={d.id}
              className="grid grid-cols-[80px_1fr_auto] items-center gap-4 rounded-xl border bg-card p-4"
            >
              <Link
                to={`/product/${d.slug}`}
                className="aspect-square overflow-hidden rounded-md bg-white"
              >
                <img
                  src={d.image ?? undefined}
                  alt={d.name}
                  loading="lazy"
                  className="h-full w-full object-contain p-1"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
              </Link>
              <div className="min-w-0">
                <Link to={`/product/${d.slug}`} className="font-semibold hover:text-accent">
                  {d.name}
                </Link>
                {(d.variantLabel || d.packageName) && (
                  <div className="text-xs text-muted-foreground">
                    {d.variantLabel ?? d.packageName}
                  </div>
                )}
                <div className="text-sm text-muted-foreground"><Price value={d.unitPrice} /> each</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center rounded-md border">
                    <button
                      onClick={() => setQty(d.id, d.qty - 1)}
                      className="grid h-8 w-8 place-items-center hover:bg-secondary"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{d.qty}</span>
                    <button
                      onClick={() => setQty(d.id, d.qty + 1)}
                      className="grid h-8 w-8 place-items-center hover:bg-secondary"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(d.id)}
                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right font-bold"><Price value={d.lineTotal} /></div>
            </div>
          ))}
          <button onClick={clear} className="text-sm text-muted-foreground hover:text-destructive">
            Clear cart
          </button>
        </div>
        <aside className="h-fit rounded-xl border bg-card p-6">
          <h2 className="text-lg font-bold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd><Price value={total} /></dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-muted-foreground">
            Shipping is calculated at checkout based on your country.
          </p>
          {canCheckout ? (
            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-md bg-primary py-3 text-center text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              Checkout
            </Link>
          ) : (
            <span className="mt-6 block w-full cursor-not-allowed rounded-md bg-secondary py-3 text-center text-sm font-bold text-muted-foreground">
              Checkout unavailable
            </span>
          )}
          <Link
            to="/peptides"
            className="mt-3 block text-center text-sm text-muted-foreground hover:text-accent"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
