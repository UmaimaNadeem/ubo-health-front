import { Fragment, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Package, Pencil, Plus, Trash2, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/contexts";
import { ApplicationStatusBanner } from "../components/ApplicationStatusBanner";
import { PaymentProofForm } from "../components/PaymentProofForm";
import { PhoneInput } from "../components/PhoneInput";
import { CountrySelect } from "../components/CountrySelect";
import { ApiError, ordersApi, useAddresses } from "../lib/api";
import type { Address, Order, SaveAddressPayload } from "../lib/api";

const input =
  "w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";

const EMPTY_FORM: SaveAddressPayload = {
  label: "",
  firstName: "",
  lastName: "",
  address: "",
  apt: "",
  city: "",
  postal: "",
  country: "United Kingdom",
  phone: "",
  isDefault: false,
};

function statusBadgeClass(status: string) {
  if (["paid", "delivered", "shipped", "processing"].includes(status)) {
    return "bg-emerald-100 text-emerald-700";
  }
  if (["pending_payment", "pending"].includes(status)) return "bg-amber-100 text-amber-700";
  if (["cancelled", "refunded"].includes(status)) return "bg-red-100 text-red-700";
  return "bg-secondary text-muted-foreground";
}

function OrdersTab() {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: ordersApi.listMyOrders,
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleProofSubmitted = (updated: Order) => {
    queryClient.setQueryData<Order[]>(["my-orders"], (prev) =>
      prev?.map((o) => (o.id === updated.id ? updated : o)),
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <Package className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">You haven't placed any orders yet.</p>
        <Link to="/peptides" className="mt-4 inline-block text-accent hover:underline">
          Browse peptides
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-5 py-3">Order</th>
            <th className="px-5 py-3">Date</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Total</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((o) => {
            const isOpen = expanded === o.id;
            return (
              <Fragment key={o.id}>
                <tr
                  onClick={() => setExpanded(isOpen ? null : o.id)}
                  className="cursor-pointer transition hover:bg-secondary/60"
                >
                  <td className="px-5 py-4 font-semibold">{o.orderNumber}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusBadgeClass(o.status)}`}
                    >
                      {o.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-bold">
                    £{o.total.toFixed(2)} {o.currency}
                  </td>
                  <td className="px-5 py-4 text-right text-xs font-semibold text-accent">
                    {isOpen ? "Hide" : "Details"}
                  </td>
                </tr>
                {isOpen && (
                  <tr>
                    <td colSpan={5} className="bg-secondary/40 px-5 py-4">
                      <ul className="divide-y divide-border/60">
                        {o.items.map((item, i) => (
                          <li key={i} className="flex items-center justify-between py-2 text-sm">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              {(item.variantLabel || item.packageName) && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {item.variantLabel ?? item.packageName}
                                </span>
                              )}
                              <span className="ml-2 text-xs text-muted-foreground">
                                × {item.qty}
                              </span>
                            </div>
                            <span className="font-semibold">£{item.lineTotal.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                        <span>
                          Shipping to: {o.shipping.address}, {o.shipping.city}, {o.shipping.country}
                        </span>
                        <span>Payment: {o.payment.label}</span>
                      </div>
                      <div className="mt-4">
                        <PaymentProofForm order={o} onSubmitted={handleProofSubmitted} />
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AddressForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: SaveAddressPayload;
  onCancel: () => void;
  onSave: (payload: SaveAddressPayload) => Promise<void>;
}) {
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const upd = <K extends keyof SaveAddressPayload>(k: K, v: SaveAddressPayload[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(f);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save this address.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-xl border bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label}>Label (optional)</label>
          <input
            value={f.label ?? ""}
            onChange={(e) => upd("label", e.target.value)}
            placeholder="Home, Office…"
            className={input}
          />
        </div>
        <div>
          <label className={label}>First name</label>
          <input
            required
            value={f.firstName}
            onChange={(e) => upd("firstName", e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Last name</label>
          <input
            required
            value={f.lastName}
            onChange={(e) => upd("lastName", e.target.value)}
            className={input}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Address</label>
          <input
            required
            value={f.address}
            onChange={(e) => upd("address", e.target.value)}
            className={input}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Apartment, suite, etc. (optional)</label>
          <input
            value={f.apt ?? ""}
            onChange={(e) => upd("apt", e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label className={label}>City</label>
          <input
            required
            value={f.city}
            onChange={(e) => upd("city", e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Postal code</label>
          <input
            required
            value={f.postal}
            onChange={(e) => upd("postal", e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Country</label>
          <CountrySelect
            value={f.country}
            onChange={(v) => upd("country", v)}
            className="rounded-md"
          />
        </div>
        <div>
          <label className={label}>Phone (optional)</label>
          <PhoneInput
            value={f.phone ?? ""}
            onChange={(v) => upd("phone", v)}
            className="rounded-md"
            placeholder="7911 123456"
          />
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={!!f.isDefault}
          onChange={(e) => upd("isDefault", e.target.checked)}
        />
        Set as default address
      </label>

      {error && <p className="mt-3 text-xs font-medium text-red-600">{error}</p>}

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddressesTab() {
  const { addresses, isLoading, create, update, remove } = useAddresses(true);
  const [editing, setEditing] = useState<string | null | "new">(null);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (editing === "new") {
    return (
      <AddressForm
        initial={EMPTY_FORM}
        onCancel={() => setEditing(null)}
        onSave={async (payload) => {
          await create(payload);
          setEditing(null);
        }}
      />
    );
  }

  const editingAddress = addresses.find((a) => a.id === editing);
  if (editingAddress) {
    return (
      <AddressForm
        initial={{
          label: editingAddress.label ?? "",
          firstName: editingAddress.firstName,
          lastName: editingAddress.lastName,
          address: editingAddress.address,
          apt: editingAddress.apt ?? "",
          city: editingAddress.city,
          postal: editingAddress.postal,
          country: editingAddress.country,
          phone: editingAddress.phone ?? "",
          isDefault: editingAddress.isDefault,
        }}
        onCancel={() => setEditing(null)}
        onSave={async (payload) => {
          await update({ id: editingAddress.id, payload });
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setEditing("new")}
        className="flex items-center gap-2 rounded-md border border-dashed px-4 py-3 text-sm font-semibold text-accent hover:bg-accent/5"
      >
        <Plus className="h-4 w-4" /> Add a new address
      </button>

      {addresses.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          You don't have any saved addresses yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a: Address) => (
            <div key={a.id} className="relative rounded-xl border bg-card p-5">
              {a.isDefault && (
                <span className="absolute right-4 top-4 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent">
                  Default
                </span>
              )}
              <div className="flex items-center gap-2 font-bold">
                <MapPin className="h-4 w-4 text-accent" />
                {a.label || "Address"}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {a.firstName} {a.lastName}
                <br />
                {a.address}
                {a.apt ? `, ${a.apt}` : ""}
                <br />
                {a.city}, {a.postal}
                <br />
                {a.country}
                {a.phone ? ` · ${a.phone}` : ""}
              </p>
              <div className="mt-4 flex gap-3 text-xs font-semibold">
                <button
                  onClick={() => setEditing(a.id)}
                  className="flex items-center gap-1 text-accent hover:underline"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => remove(a.id)}
                  className="flex items-center gap-1 text-red-600 hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Profile() {
  const { user, loading, logout } = useAuth();
  const [tab, setTab] = useState<"orders" | "addresses">("orders");

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center text-muted-foreground">Loading…</div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <ApplicationStatusBanner />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accent">
            <UserIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-black">
              {user.firstName ? `${user.firstName} ${user.lastName ?? ""}` : user.email}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold capitalize text-muted-foreground">
              {user.role}
            </span>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-secondary"
        >
          Log out
        </button>
      </div>

      <div className="mb-6 flex gap-2 border-b">
        <button
          onClick={() => setTab("orders")}
          className={`border-b-2 px-4 py-3 text-sm font-bold transition ${
            tab === "orders"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          My Orders
        </button>
        <button
          onClick={() => setTab("addresses")}
          className={`border-b-2 px-4 py-3 text-sm font-bold transition ${
            tab === "addresses"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          My Addresses
        </button>
      </div>

      {tab === "orders" ? <OrdersTab /> : <AddressesTab />}
    </div>
  );
}
