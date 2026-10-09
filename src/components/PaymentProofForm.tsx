import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, UploadCloud } from "lucide-react";
import { ApiError, ordersApi, useGbpToUsdtRate } from "../lib/api";
import type { Order } from "../lib/api";

function statusBadgeClass(status: string) {
  if (status === "accepted") return "bg-emerald-100 text-emerald-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

export function PaymentProofForm({
  order,
  guestEmail,
  onSubmitted,
}: {
  order: Order;
  guestEmail?: string;
  onSubmitted?: (order: Order) => void;
}) {
  const [txHash, setTxHash] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const address = order.payment.walletAddress;
  const hasPending = order.paymentProofs.some((p) => p.status === "pending");
  const { data: rate } = useGbpToUsdtRate();
  const usdtAmount = rate ? order.total * rate : null;

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash.trim() && !receipt) {
      setError("Enter a transaction hash or upload a receipt.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const updated = await ordersApi.submitPaymentProof(order.id, {
        txHash: txHash.trim() || undefined,
        receipt: receipt ?? undefined,
        email: guestEmail,
      });
      setTxHash("");
      setReceipt(null);
      onSubmitted?.(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit your payment proof.");
    } finally {
      setSubmitting(false);
    }
  };

  if (order.paymentStatus === "paid") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        <Check className="h-4 w-4 shrink-0" />
        Payment received and verified — thank you.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {address && (
        <div className="rounded-xl border bg-card p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {order.payment.label} — send payment to
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <div className="rounded-lg border bg-white p-2">
              <QRCodeSVG value={address} size={112} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <code className="break-all rounded-md bg-secondary px-2.5 py-1.5 text-xs font-medium">
                  {address}
                </code>
                <button
                  type="button"
                  onClick={copyAddress}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-md border hover:bg-secondary"
                  aria-label="Copy wallet address"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="mt-2 text-sm font-bold">
                Amount due: £{order.total.toFixed(2)} {order.currency}
                {usdtAmount !== null && <> (≈ {usdtAmount.toFixed(2)} USDT)</>}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{order.payment.instructions}</p>
            </div>
          </div>
        </div>
      )}

      {order.paymentProofs.length > 0 && (
        <div className="rounded-xl border bg-card p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Submitted proof
          </div>
          <ul className="mt-2 space-y-2">
            {order.paymentProofs.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 text-xs">
                <span className="truncate text-muted-foreground">
                  {p.txHash ? `Tx: ${p.txHash}` : "Receipt uploaded"}
                </span>
                <span className={`rounded-full px-2 py-0.5 font-semibold ${statusBadgeClass(p.status)}`}>
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasPending ? (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <Check className="h-4 w-4 shrink-0" />
          Your payment proof is under review — we'll notify you once it's verified. No need to
          submit again.
        </div>
      ) : (
        <form onSubmit={submit} className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-bold">Submit your payment for verification</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Once you've sent the payment, provide the transaction hash and/or upload a screenshot
            of the receipt so our team can verify it.
          </p>

          <label className="mb-1.5 mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Transaction hash
          </label>
          <input
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="0x… or Tron tx hash"
            className="w-full rounded-md border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />

          <label className="mb-1.5 mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Or upload a receipt screenshot
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground hover:bg-secondary">
            <UploadCloud className="h-4 w-4" />
            {receipt ? receipt.name : "Choose an image (JPG, PNG or WEBP, max 5MB)"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
            />
          </label>

          {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-md bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit for verification"}
          </button>
        </form>
      )}
    </div>
  );
}
