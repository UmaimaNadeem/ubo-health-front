import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-700" aria-hidden="true">
        ✓
      </div>
      <h1 className="mt-6 text-3xl font-black">Payment successful</h1>
      <p className="mt-3 text-muted-foreground">
        Thank you. Your payment has been received and your order is being processed.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        You will receive order updates using the contact details provided at checkout.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground">
          Return home
        </Link>
        <Link to="/peptides" className="rounded-md border px-5 py-3 font-semibold">
          Continue browsing
        </Link>
      </div>
    </div>
  );
}
