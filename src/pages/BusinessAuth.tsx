import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Building2, Check, Lock, LogIn, Mail, UserPlus } from "lucide-react";
import { useAuth } from "../context/contexts";
import { ApiError } from "../lib/api";

const PERKS = [
  "Explore a range of trade account options built around how your business buys.",
  "Unlock preferential pricing as your order volumes grow.",
  "Get direct support from our dedicated trade specialists.",
  "Wholesale and private-label orders are arranged under a separate agreement.",
  "Every trade account requires acknowledgement of our research-use terms at signup.",
];

function TradePerksPanel() {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-xl md:p-8">
      <h2 className="text-lg font-black md:text-xl">
        New to ONYX Research? Open a trade account and unlock extra perks.
      </h2>
      <ul className="mt-5 space-y-3">
        {PERKS.map((perk) => (
          <li key={perk} className="flex items-start gap-3 text-sm">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="text-foreground/80">{perk}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/wholesale-application"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-bold text-accent-foreground hover:bg-accent/90"
      >
        Contact us to discuss your requirements
      </Link>
    </div>
  );
}

export function BusinessLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  if (user) return <Navigate to="/wishlist" replace />;
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 2xl:py-24">
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <div className="rounded-3xl border bg-card p-8 shadow-xl md:p-10">
          <div className="mb-8 text-center">
            <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
              <LogIn className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-black">B2B sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Access your trade account, wholesale pricing, and order history.
            </p>
          </div>
          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setSubmitting(true);
              try {
                await login(email, password);
                navigate("/profile");
              } catch (err) {
                setError(err instanceof ApiError ? err.message : "Unable to sign in right now.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <div>
              <label
                htmlFor="b2b-login-email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Business email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="b2b-login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="b2b-login-password"
                  className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-accent hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="b2b-login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="h-4 w-4 rounded border accent-accent" />
              Remember me
            </label>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button
              disabled={submitting}
              className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Not a trade customer yet?{" "}
            <Link to="/b2b-register" className="font-semibold text-accent hover:underline">
              Open a trade account
            </Link>
          </p>
        </div>
        <TradePerksPanel />
      </div>
    </div>
  );
}

export function BusinessRegister() {
  const { user, wholesaleApply } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [requestedRole, setRequestedRole] = useState<"retailer" | "wholesaler">("wholesaler");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  if (user) return <Navigate to="/wishlist" replace />;
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 2xl:py-24">
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <div className="rounded-3xl border bg-card p-8 shadow-xl md:p-10">
          <div className="mb-8 text-center">
            <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
              <UserPlus className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-black">Open a trade account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Register your business to access trade pricing and dedicated support.
            </p>
          </div>
          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
              }
              setError("");
              setSubmitting(true);
              try {
                await wholesaleApply({ email, password, requestedRole, businessName: company });
                navigate("/profile");
              } catch (err) {
                setError(err instanceof ApiError ? err.message : "Unable to submit your application.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <div>
              <label
                htmlFor="b2b-register-company"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Company name
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="b2b-register-company"
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company name"
                  className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="b2b-register-role"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Account type
              </label>
              <select
                id="b2b-register-role"
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value as "retailer" | "wholesaler")}
                className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                <option value="wholesaler">Wholesaler</option>
                <option value="retailer">Retailer</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="b2b-register-email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Business email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="b2b-register-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@business.com"
                  className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="b2b-register-password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="b2b-register-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  minLength={8}
                  className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="b2b-register-confirm-password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="b2b-register-confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  minLength={8}
                  className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button
              disabled={submitting}
              className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Create trade account"}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Your account is created immediately with {requestedRole} pricing pending — an admin
            reviews and approves applications before tier pricing becomes active.
          </p>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have a trade account?{" "}
            <Link to="/b2b-login" className="font-semibold text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <TradePerksPanel />
      </div>
    </div>
  );
}
