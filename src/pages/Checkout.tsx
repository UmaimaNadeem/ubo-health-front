import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Lock, Coins, Truck } from "lucide-react";
import { useAuth, useCart } from "../context/contexts";
import {
  ApplicationStatusBanner,
  useApplicationStatus,
} from "../components/ApplicationStatusBanner";
import { PaymentProofForm } from "../components/PaymentProofForm";
import { TrustBadges } from "../components/TrustBadges";
import { PhoneInput } from "../components/PhoneInput";
import { CountrySelect } from "../components/CountrySelect";
import { isEmail, isPhone } from "../lib/formValidation";
import Price from "../components/Price";

import {
  ApiError,
  ordersApi,
  couponsApi,
  useShippingZones,
  useAddresses,
  usePaymentMethods,
} from "../lib/api";
import type { PlacedOrder, ShippingRate } from "../lib/api";

type Form = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apt: string;
  city: string;
  postal: string;
  country: string;
  phone: string;
  shipping: "standard" | "express";
  paymentMethod: string;
};

function validate(f: Form): Partial<Record<keyof Form, string>> {
  const e: Partial<Record<keyof Form, string>> = {};
  if (!f.email.trim()) e.email = "Email is required.";
  else if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (!f.firstName.trim()) e.firstName = "First name is required.";
  if (!f.lastName.trim()) e.lastName = "Last name is required.";
  if (!f.address.trim()) e.address = "Address is required.";
  if (!f.city.trim()) e.city = "City is required.";
  if (!f.postal.trim()) e.postal = "Postal code is required.";
  if (!f.country.trim()) e.country = "Please select a country.";
  if (!f.phone.trim()) e.phone = "Phone number is required.";
  else if (!isPhone(f.phone)) e.phone = "Enter a valid phone number.";
  return e;
}

/** Mirrors the backend's ShippingCalculator for a live estimate before submit. */
function estimateShippingCost(rate: ShippingRate | undefined, subtotal: number): number | null {
  if (!rate) return null;
  if (rate.freeShippingThreshold !== null && subtotal >= rate.freeShippingThreshold) return 0;
  if (rate.pricingModel === "flat") return rate.flatPrice ?? 0;
  // Weight-based: cart doesn't carry per-line weight client-side, so this is a
  // floor estimate (base price only) — the authoritative total comes back from
  // the order placement response.
  return rate.basePrice ?? 0;
}

const NEW_ADDRESS = "__new__";

export default function Checkout() {
  const queryClient = useQueryClient();
  const { items, total, clear } = useCart();
  const { data: zones = [] } = useShippingZones();
  const { user } = useAuth();
  const { addresses, create: createAddress } = useAddresses(!!user);
  const { data: paymentMethods = [] } = usePaymentMethods();
  const applicationStatus = useApplicationStatus();
  const canCheckout = !applicationStatus;
  const [f, setF] = useState<Form>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apt: "",
    city: "",
    postal: "",
    country: "United Kingdom",
    phone: "",
    shipping: "standard",
    paymentMethod: "",
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string>(NEW_ADDRESS);
  const [saveAddress, setSaveAddress] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [openingCardPayment, setOpeningCardPayment] = useState(false);
  const [cardPaymentError, setCardPaymentError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-fill contact/name details for a logged-in shopper — email is owned by
  // the account so it's locked below rather than left editable.
  useEffect(() => {
    if (!user) return;
    setF((p) => ({
      ...p,
      email: user.email,
      firstName: p.firstName || user.firstName || "",
      lastName: p.lastName || user.lastName || "",
      phone: p.phone || user.phone || "",
      country: user.country || p.country,
    }));
  }, [user]);

  // Default to the first available payment method once the list loads.
  useEffect(() => {
    if (!f.paymentMethod && paymentMethods.length > 0) {
      setF((p) => ({ ...p, paymentMethod: paymentMethods[0].code }));
    }
  }, [paymentMethods, f.paymentMethod]);

  // Applies a saved address to the shipping fields (email/name stay independent).
  useEffect(() => {
    if (selectedAddressId === NEW_ADDRESS) return;
    const addr = addresses.find((a) => a.id === selectedAddressId);
    if (!addr) return;
    setF((p) => ({
      ...p,
      firstName: addr.firstName,
      lastName: addr.lastName,
      address: addr.address,
      apt: addr.apt ?? "",
      city: addr.city,
      postal: addr.postal,
      country: addr.country,
      phone: addr.phone ?? p.phone,
    }));
  }, [selectedAddressId, addresses]);

  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponChecking, setCouponChecking] = useState(false);

  const upd = <K extends keyof Form>(k: K, v: Form[K]) =>
    setF((p) => {
      const next = { ...p, [k]: v };
      if (submitted) setErrors(validate(next));
      return next;
    });

  const zone = useMemo(() => {
    const direct = zones.find((z) => z.countries.includes(f.country));
    return direct ?? zones.find((z) => z.name === "Rest of World");
  }, [zones, f.country]);
  const rate = zone?.rates.find((r) => r.method === f.shipping);
  const shippingCost = estimateShippingCost(rate, total) ?? 0;
  const grand = +(total - couponDiscount + shippingCost).toFixed(2);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponChecking(true);
    setCouponError(null);
    try {
      const result = await couponsApi.validateCoupon(couponInput.trim(), total);
      if (result.valid) {
        setCouponCode(couponInput.trim());
        setCouponDiscount(result.discountAmount);
      }
    } catch (err) {
      setCouponCode(null);
      setCouponDiscount(0);
      setCouponError(err instanceof ApiError ? err.message : "Could not validate this code.");
    } finally {
      setCouponChecking(false);
    }
  };

  const openCardPayment = async (placedOrder: PlacedOrder) => {
    setOpeningCardPayment(true);
    setCardPaymentError(null);

    try {
      let paymentUrl = placedOrder.paymentSession?.paymentUrl ?? null;

      if (!paymentUrl) {
        const session = await ordersApi.createPaymentSession(
          placedOrder.id,
          !user ? placedOrder.contactEmail : undefined,
        );
        paymentUrl = session.paymentUrl;
      }

      if (!paymentUrl) {
        throw new Error("Payment session did not include a payment URL.");
      }

      const destination = new URL(paymentUrl);
      if (destination.protocol !== "https:" || destination.hostname !== "euro-nutra.com") {
        throw new Error("Unexpected payment destination.");
      }

      window.location.assign(destination.toString());
    } catch (err) {
      setCardPaymentError(
        err instanceof ApiError
          ? err.message
          : "Your order was created, but we could not open the secure card payment page. Please try again.",
      );
      setOpeningCardPayment(false);
    }
  };

  if (order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-black">Your order has been created</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you. Your order <strong>{order.orderNumber}</strong> has been received — a
          confirmation email is on its way to {order.contactEmail}.
          {order.payment.method === "credit_card"
            ? " Your payment is not complete yet."
            : " Complete step 2 below to send your payment and submit it for verification."}
        </p>

        {order.payment.method === "credit_card" ? (
          <div className="mt-8 rounded-xl border bg-card p-5 text-left">
            <h2 className="text-base font-bold">Complete your payment securely</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You’ll now be transferred to our secure payment partner, <strong>Euro Nutra</strong>,
              to complete your payment. You can choose Credit/Debit Card or PayPal on the next page.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Your order will be confirmed for processing once payment is completed. You’ll return
              to Onyx after payment.
            </p>
            {cardPaymentError && (
              <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                {cardPaymentError}
              </div>
            )}
            <button
              type="button"
              disabled={openingCardPayment}
              onClick={() => void openCardPayment(order)}
              className="mt-5 w-full rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {openingCardPayment ? "Opening secure payment…" : "Continue to Secure Payment"}
            </button>
          </div>
        ) : (
          <div className="mt-8 text-left">
            <PaymentProofForm
              order={order}
              guestEmail={!user ? order.contactEmail : undefined}
              onSubmitted={setOrder}
            />
          </div>
        )}

        <Link
          to="/peptides"
          className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black">Your cart is empty</h1>
        <Link to="/peptides" className="mt-6 inline-block text-accent hover:underline">
          Browse peptides →
        </Link>
      </div>
    );
  }

  if (!canCheckout) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <ApplicationStatusBanner />
        <div className="text-center">
          <Link to="/cart" className="inline-block text-accent hover:underline">
            ← Back to cart
          </Link>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(f);
    setErrors(found);
    setSubmitted(true);
    const termsMissing = !agreedToTerms;
    setTermsError(
      termsMissing
        ? "You must read and agree to the terms and conditions to place your order."
        : null,
    );
    if (Object.keys(found).length > 0 || termsMissing) {
      const firstError = document.querySelector('[aria-invalid="true"]');
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setPlacing(true);
    setSubmitError(null);
    try {
      const placed = await ordersApi.placeOrder({
        contactEmail: f.email,
        shippingFirstName: f.firstName,
        shippingLastName: f.lastName,
        shippingAddress: f.address,
        shippingApt: f.apt || undefined,
        shippingCity: f.city,
        shippingPostal: f.postal,
        shippingCountry: f.country,
        shippingPhone: f.phone,
        shippingMethod: f.shipping,
        paymentMethodCode: f.paymentMethod,
        couponCode: couponCode ?? undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // First-ever address for a logged-in shopper is always saved (so it's
      // there next time without them having to think about it); after that,
      // saving another one is opt-in via the checkbox.
      if (user && selectedAddressId === NEW_ADDRESS && (saveAddress || addresses.length === 0)) {
        try {
          await createAddress({
            firstName: f.firstName,
            lastName: f.lastName,
            address: f.address,
            apt: f.apt || undefined,
            city: f.city,
            postal: f.postal,
            country: f.country,
            phone: f.phone || undefined,
            isDefault: addresses.length === 0,
          });
        } catch {
          // Non-fatal — the order already succeeded, so don't block confirmation on this.
        }
      }

      setOrder(placed);

      // Keep the customer on Onyx after the order is created. For hosted
      // card/PayPal checkout, the confirmation screen explains the Euro Nutra
      // handoff and lets the customer explicitly continue to secure payment.
      window.scrollTo(0, 0);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Something went wrong placing your order.",
      );
    } finally {
      setPlacing(false);
    }
  };

  const input =
    "w-full rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";
  const inputError = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";
  const errText = "mt-1.5 text-xs font-medium text-red-600";
  const cx = (k: keyof Form) => `${input} ${errors[k] ? inputError : ""}`;

  return (
    <div className="bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/cart" className="hover:text-accent">
            Cart
          </Link>
          <span>›</span>
          <span className="font-semibold text-foreground">Checkout</span>
          <span>›</span>
          <span>Confirmation</span>
        </div>

        <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <section className="rounded-2xl border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
                  1
                </span>
                Contact
              </h2>
              {user ? (
                <>
                  <label className={label}>Email address</label>
                  <div className="flex items-center justify-between rounded-md border bg-secondary px-4 py-3 text-sm">
                    <span>{user.email}</span>
                    <span className="text-xs font-medium text-muted-foreground">Signed in</span>
                  </div>
                </>
              ) : (
                <>
                  <label className={label}>Email address</label>
                  <input
                    type="email"
                    value={f.email}
                    onChange={(e) => upd("email", e.target.value)}
                    placeholder="you@example.com"
                    className={cx("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className={errText}>{errors.email}</p>}
                </>
              )}
            </section>

            <section className="rounded-2xl border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
                  2
                </span>
                Shipping address
              </h2>

              {user && addresses.length > 0 && (
                <div className="mb-4">
                  <label className={label}>Use a saved address</label>
                  <select
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className={input}
                  >
                    <option value={NEW_ADDRESS}>Enter a new address</option>
                    {addresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label ? `${a.label} - ` : ""}
                        {a.address}, {a.city}
                        {a.isDefault ? " (default)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label}>First name</label>
                  <input
                    value={f.firstName}
                    onChange={(e) => upd("firstName", e.target.value)}
                    className={cx("firstName")}
                    aria-invalid={!!errors.firstName}
                  />
                  {errors.firstName && <p className={errText}>{errors.firstName}</p>}
                </div>
                <div>
                  <label className={label}>Last name</label>
                  <input
                    value={f.lastName}
                    onChange={(e) => upd("lastName", e.target.value)}
                    className={cx("lastName")}
                    aria-invalid={!!errors.lastName}
                  />
                  {errors.lastName && <p className={errText}>{errors.lastName}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Address</label>
                  <input
                    value={f.address}
                    onChange={(e) => upd("address", e.target.value)}
                    className={cx("address")}
                    aria-invalid={!!errors.address}
                  />
                  {errors.address && <p className={errText}>{errors.address}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Apartment, suite, etc. (optional)</label>
                  <input
                    value={f.apt}
                    onChange={(e) => upd("apt", e.target.value)}
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>City</label>
                  <input
                    value={f.city}
                    onChange={(e) => upd("city", e.target.value)}
                    className={cx("city")}
                    aria-invalid={!!errors.city}
                  />
                  {errors.city && <p className={errText}>{errors.city}</p>}
                </div>
                <div>
                  <label className={label}>Postal code</label>
                  <input
                    value={f.postal}
                    onChange={(e) => upd("postal", e.target.value)}
                    className={cx("postal")}
                    aria-invalid={!!errors.postal}
                  />
                  {errors.postal && <p className={errText}>{errors.postal}</p>}
                </div>
                <div>
                  <label className={label}>Country</label>
                  <CountrySelect
                    value={f.country}
                    onChange={(v) => upd("country", v)}
                    invalid={!!errors.country}
                    className="rounded-md"
                  />
                  {errors.country && <p className={errText}>{errors.country}</p>}
                </div>
                <div>
                  <label className={label}>Phone</label>
                  <PhoneInput
                    value={f.phone}
                    onChange={(v) => upd("phone", v)}
                    invalid={!!errors.phone}
                    className="rounded-md"
                    placeholder="7911 123456"
                  />
                  {errors.phone && <p className={errText}>{errors.phone}</p>}
                </div>
              </div>

              {user &&
                selectedAddressId === NEW_ADDRESS &&
                (addresses.length === 0 ? (
                  <p className="mt-4 text-xs text-muted-foreground">
                    This will be saved as your address for next time.
                  </p>
                ) : (
                  <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                    />
                    Save this address to my profile for next time
                  </label>
                ))}
            </section>

            <section className="rounded-2xl border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
                  3
                </span>
                <Truck className="h-5 w-5" />
                Shipping method
              </h2>
              <div className="space-y-2">
                {(["standard", "express"] as const).map((method) => {
                  const methodRate = zone?.rates.find((r) => r.method === method);
                  const price = estimateShippingCost(methodRate, total) ?? 0;
                  return (
                    <label
                      key={method}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition ${f.shipping === method ? "border-accent bg-accent/5" : "hover:bg-secondary"}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="ship"
                          checked={f.shipping === method}
                          onChange={() => upd("shipping", method)}
                        />
                        <div>
                          <div className="text-sm font-semibold capitalize">{method} shipping</div>
                          <div className="text-xs text-muted-foreground">
                            {methodRate?.etaLabel ?? "Calculated at checkout"}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold">
                        {price === 0 ? "Free" : `£${price.toFixed(2)}`}
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
                  4
                </span>
                <Coins className="h-5 w-5" />
                Payment
              </h2>
              <div className="space-y-2">
                {paymentMethods.map((pm) => (
                  <label
                    key={pm.code}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${f.paymentMethod === pm.code ? "border-accent bg-accent/5" : "hover:bg-secondary"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={f.paymentMethod === pm.code}
                      onChange={() => upd("paymentMethod", pm.code)}
                    />
                    <span className="text-sm font-semibold">{pm.label}</span>
                  </label>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                The wallet address and a QR code will appear on the confirmation screen once your
                order is placed. You'll then submit your transaction hash or a receipt for
                verification.
              </p>
            </section>

            {submitError && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (e.target.checked) setTermsError(null);
                  }}
                  aria-invalid={!!termsError}
                  className="mt-1 h-4 w-4 shrink-0"
                />
                <span>
                  I confirm that I am 21 years of age or older and that I am buying these products
                  strictly for laboratory research use. I understand they are not intended for human
                  or animal consumption. I accept the ONYX Research{" "}
                  <Link
                    to="/terms-conditions"
                    target="_blank"
                    className="font-semibold text-accent hover:underline"
                  >
                    terms and conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    target="_blank"
                    className="font-semibold text-accent hover:underline"
                  >
                    privacy policy
                  </Link>
                  , and I consent to receiving marketing communications from ONYX Research.{" "}
                  <span className="text-red-600">*</span>
                </span>
              </label>
              {termsError ? (
                <p className={errText}>{termsError}</p>
              ) : (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Please confirm this before placing your order.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={placing || !f.paymentMethod}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-4 text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock className="h-4 w-4" />{" "}
              {placing ? "Placing order…" : `Place order · £${grand.toFixed(2)}`}
            </button>
          </div>

          <aside className="h-fit space-y-4 rounded-2xl border bg-card p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold">Order summary</h2>
            <ul className="divide-y">
              {items.map((d) => (
                <li key={d.id} className="flex items-center gap-3 py-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-white">
                    <img
                      src={d.image ?? undefined}
                      alt={d.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.style.visibility = "hidden";
                      }}
                    />
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {d.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{d.name}</div>
                    {(d.variantLabel || d.packageName) && (
                      <div className="text-xs text-muted-foreground">
                        {d.variantLabel ?? d.packageName}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground"><Price value={d.unitPrice} /> each</div>
                  </div>
                  <div className="text-sm font-bold"><Price value={d.lineTotal} /></div>
                </li>
              ))}
            </ul>
            <div>
              <div className="flex gap-2">
                <input
                  placeholder="Discount code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className={input}
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponChecking}
                  className="rounded-md border px-4 text-sm font-semibold hover:bg-secondary disabled:opacity-60"
                >
                  {couponChecking ? "…" : "Apply"}
                </button>
              </div>
              {couponError && <p className={errText}>{couponError}</p>}

                {couponCode && !couponError && (
                  <p className="mt-1.5 text-xs font-medium text-emerald-700">
                    "{couponCode}" applied: -<Price value={couponDiscount} />
                  </p>
              )}
            </div>
            <dl className="space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd><Price value={total} /></dd>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <dt>Discount</dt>
                  <dd><Price value={couponDiscount} /></dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>{shippingCost === 0 ? ( "Free" ) : ( <Price value={shippingCost} /> )}</dd>
              </div>
              <div className="mt-3 flex justify-between border-t pt-3 text-lg font-black">
                <dt>Total</dt>
                <dd><Price value={grand} /></dd>
              </div>
            </dl>
            <div className="rounded-md bg-secondary p-3 text-xs text-muted-foreground">
              <Lock className="mb-1 inline h-3 w-3" /> Secure 256-bit SSL encrypted checkout. Your
              payment details are never stored.
            </div>

            <TrustBadges className="border-t pt-5" />
          </aside>
        </form>
      </div>
    </div>
  );
}
