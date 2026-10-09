import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { useProducts, usePlans } from "../lib/api";
import { useAuth, useCart } from "../context/contexts";
import {
  ApplicationStatusBanner,
  useApplicationStatus,
} from "../components/ApplicationStatusBanner";
import { useTimedFlag } from "../hooks/useTimedFlag";
import type { Product } from "../lib/api";

function ProductRow({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState<string>(product.variants?.[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [added, flashAdded] = useTimedFlag();

  const variant = product.variants?.find((v) => v.id === variantId);
  const unitPrice = variant ? variant.price : product.price;
  const outOfStock = variant ? variant.outOfStock : product.outOfStock;
  const comingSoon = variant ? variant.comingSoon || product.comingSoon : product.comingSoon;

  const handleAdd = async () => {
    if (outOfStock || comingSoon) return;
    await addItem({ productId: product.id, variantId: variant?.id, qty });
    flashAdded();
    setQty(1);
  };

  return (
    <div className="grid grid-cols-[56px_1fr_auto_auto_auto] items-center gap-4 border-b px-4 py-3 last:border-b-0">
      <Link
        to={`/product/${product.slug}`}
        className="aspect-square overflow-hidden rounded-md border bg-white"
      >
        <img
          src={product.image ?? undefined}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-1"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
      </Link>

      <div className="min-w-0">
        <Link to={`/product/${product.slug}`} className="font-semibold hover:text-accent">
          {product.name}
        </Link>
        <div className="text-xs text-muted-foreground">{product.category}</div>
        {comingSoon && (
          <span className="mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            Coming soon
          </span>
        )}
        {!comingSoon && outOfStock && (
          <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
            Out of stock
          </span>
        )}
      </div>

      {product.variants && product.variants.length > 0 ? (
        <select
          value={variantId}
          onChange={(e) => setVariantId(e.target.value)}
          className="rounded-md border bg-background px-2 py-2 text-xs"
        >
          {product.variants.map((v) => (
            <option key={v.id} value={v.id} disabled={v.outOfStock || v.comingSoon}>
              {v.label} · £{v.price}
              {v.comingSoon ? " (coming soon)" : v.outOfStock ? " (out of stock)" : ""}
            </option>
          ))}
        </select>
      ) : (
        <span className="text-sm font-bold">£{unitPrice}</span>
      )}

      <div className="flex items-center rounded-md border">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="grid h-8 w-8 place-items-center hover:bg-secondary"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-9 text-center text-sm font-semibold">{qty}</span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="grid h-8 w-8 place-items-center hover:bg-secondary"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      <button
        onClick={handleAdd}
        disabled={outOfStock || comingSoon}
        className={`rounded-md px-4 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
          added
            ? "bg-emerald-600 text-white"
            : "bg-accent text-accent-foreground hover:bg-accent/90"
        }`}
      >
        {added ? "Added ✓" : "Add"}
      </button>
    </div>
  );
}

export default function QuickOrder() {
  const { user, loading } = useAuth();
  const { data: products = [], isLoading } = useProducts();
  const { data: plans = [] } = usePlans();
  const { items, setQty, remove, total, count } = useCart();

  const [search, setSearch] = useState("");

  const planProductIds = useMemo(() => new Set(plans.map((p) => p.id)), [plans]);

  const filtered = useMemo(() => {
    return products
      .filter((p) => !planProductIds.has(p.id))
      .filter((p) => !search.trim() || p.name.toLowerCase().includes(search.trim().toLowerCase()))
      .slice()
      .sort((a, b) => Number(a.outOfStock) - Number(b.outOfStock));
  }, [products, planProductIds, search]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">Loading…</div>
    );
  }
  if (!user || (user.role !== "retailer" && user.role !== "wholesaler")) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-black">Quick Order</h1>
        <p className="mt-1 text-muted-foreground">
          Build an order fast, pick quantities across the full catalog and add straight to your
          cart.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-md border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border bg-card">
            {isLoading ? (
              <div className="p-12 text-center text-muted-foreground">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No products match.</div>
            ) : (
              <div className="min-w-[520px]">
                {filtered.map((p) => (
                  <ProductRow key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShoppingCart className="h-5 w-5" /> Current order ({count})
          </h2>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing added yet — items you add will show up here.
            </p>
          ) : (
            <ul className="max-h-96 divide-y overflow-y-auto">
              {items.map((d) => (
                <li key={d.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{d.name}</div>
                    {(d.variantLabel || d.packageName) && (
                      <div className="text-xs text-muted-foreground">
                        {d.variantLabel ?? d.packageName}
                      </div>
                    )}
                    <div className="mt-1 flex items-center gap-1.5">
                      <button
                        onClick={() => setQty(d.id, d.qty - 1)}
                        className="grid h-6 w-6 place-items-center rounded border hover:bg-secondary"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-semibold">{d.qty}</span>
                      <button
                        onClick={() => setQty(d.id, d.qty + 1)}
                        className="grid h-6 w-6 place-items-center rounded border hover:bg-secondary"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => remove(d.id)}
                        className="ml-1 grid h-6 w-6 place-items-center rounded text-muted-foreground hover:bg-secondary hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-bold">£{d.lineTotal.toFixed(2)}</div>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between border-t pt-4 text-lg font-black">
            <span>Subtotal</span>
            <span>£{total.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className={`block w-full rounded-md py-3 text-center text-sm font-bold transition ${
              items.length === 0
                ? "pointer-events-none bg-secondary text-muted-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
