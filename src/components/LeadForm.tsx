import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { PhoneInput } from "./PhoneInput";
import { CountrySelect } from "./CountrySelect";
import { useFormValidation, isEmail, isPhone, type Errors } from "../lib/formValidation";
import { useAuth } from "../context/contexts";
import { ApiError, leadsApi } from "../lib/api";

const input =
  "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const inputError = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const errorText = "mt-1.5 text-xs font-medium text-red-600";

type LeadValues = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  message: string;
  password: string;
  confirmPassword: string;
  requestedRole: string;
};

const initial: LeadValues = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  phone: "",
  country: "",
  message: "",
  password: "",
  confirmPassword: "",
  requestedRole: "wholesaler",
};

export type LeadFormProps = {
  /** Distinguishes the submission on the backend and toggles the company field. */
  kind: "contact" | "wholesale";
  heading: string;
  intro?: ReactNode;
  submitLabel: string;
  submitIcon?: ReactNode;
  emailPlaceholder?: string;
  messagePlaceholder?: string;
  success: { title: string; body: string; extra?: ReactNode };
};

export function LeadForm({
  kind,
  heading,
  intro,
  submitLabel,
  submitIcon,
  emailPlaceholder = "you@example.com",
  messagePlaceholder = "How can we help?",
  success,
}: LeadFormProps) {
  const showCompany = kind === "wholesale";
  const { wholesaleApply } = useAuth();

  const validate = (v: LeadValues): Errors<LeadValues> => {
    const e: Errors<LeadValues> = {};
    if (!v.firstName.trim()) e.firstName = "First name is required.";
    if (!v.lastName.trim()) e.lastName = "Last name is required.";
    if (!v.email.trim()) e.email = "Email is required.";
    else if (!isEmail(v.email)) e.email = "Enter a valid email address.";
    if (showCompany && !v.company.trim()) e.company = "Company name is required.";
    if (!v.phone.trim()) e.phone = "Phone number is required.";
    else if (!isPhone(v.phone)) e.phone = "Enter a valid phone number.";
    if (!v.country) e.country = "Please select a country.";
    if (showCompany) {
      if (!v.password || v.password.length < 8)
        e.password = "Password must be at least 8 characters.";
      if (v.password !== v.confirmPassword) e.confirmPassword = "Passwords do not match.";
    }
    return e;
  };

  const { values, errors, setField, handleSubmit } = useFormValidation(initial, validate);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onValid = async (v: LeadValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (kind === "wholesale") {
        await wholesaleApply({
          email: v.email,
          password: v.password,
          requestedRole: v.requestedRole as "retailer" | "wholesaler",
          businessName: v.company,
          phone: v.phone,
          country: v.country,
          message: v.message || undefined,
          firstName: v.firstName,
          lastName: v.lastName,
        });
      } else {
        await leadsApi.submitLead({
          firstName: v.firstName,
          lastName: v.lastName,
          email: v.email,
          phone: v.phone,
          country: v.country,
          message: v.message || undefined,
        });
      }
      setSent(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="py-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="mt-6 text-2xl font-black">{success.title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{success.body}</p>
        {success.extra}
      </div>
    );
  }

  const cx = (k: keyof LeadValues) => `${input} ${errors[k] ? inputError : ""}`;

  return (
    <>
      <h2 className="text-xl font-black md:text-2xl">{heading}</h2>
      {intro && <p className="mt-2 text-sm text-muted-foreground">{intro}</p>}

      <form onSubmit={handleSubmit(onValid)} noValidate className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              First name <span className="text-accent">*</span>
            </label>
            <input
              value={values.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
              className={cx("firstName")}
              placeholder="First name"
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && <p className={errorText}>{errors.firstName}</p>}
          </div>
          <div>
            <label className={labelClass}>
              Last name <span className="text-accent">*</span>
            </label>
            <input
              value={values.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
              className={cx("lastName")}
              placeholder="Last name"
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && <p className={errorText}>{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Email <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            className={cx("email")}
            placeholder={emailPlaceholder}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className={errorText}>{errors.email}</p>}
        </div>

        {showCompany && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Company name <span className="text-accent">*</span>
                </label>
                <input
                  value={values.company}
                  onChange={(e) => setField("company", e.target.value)}
                  className={cx("company")}
                  placeholder="Your company"
                  aria-invalid={!!errors.company}
                />
                {errors.company && <p className={errorText}>{errors.company}</p>}
              </div>
              <div>
                <label className={labelClass}>
                  Account type <span className="text-accent">*</span>
                </label>
                <select
                  value={values.requestedRole}
                  onChange={(e) => setField("requestedRole", e.target.value)}
                  className={input}
                >
                  <option value="wholesaler">Wholesaler</option>
                  <option value="retailer">Retailer</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Password <span className="text-accent">*</span>
                </label>
                <input
                  type="password"
                  value={values.password}
                  onChange={(e) => setField("password", e.target.value)}
                  className={cx("password")}
                  placeholder="Min. 8 characters"
                  aria-invalid={!!errors.password}
                />
                {errors.password && <p className={errorText}>{errors.password}</p>}
              </div>
              <div>
                <label className={labelClass}>
                  Confirm password <span className="text-accent">*</span>
                </label>
                <input
                  type="password"
                  value={values.confirmPassword}
                  onChange={(e) => setField("confirmPassword", e.target.value)}
                  className={cx("confirmPassword")}
                  placeholder="Re-enter password"
                  aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && <p className={errorText}>{errors.confirmPassword}</p>}
              </div>
            </div>
          </>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Phone <span className="text-accent">*</span>
            </label>
            <PhoneInput
              value={values.phone}
              onChange={(v) => setField("phone", v)}
              invalid={!!errors.phone}
              placeholder="7911 123456"
            />
            {errors.phone && <p className={errorText}>{errors.phone}</p>}
          </div>

          <div>
            <label className={labelClass}>
              Country <span className="text-accent">*</span>
            </label>
            <CountrySelect
              value={values.country}
              onChange={(v) => setField("country", v)}
              invalid={!!errors.country}
            />
            {errors.country && <p className={errorText}>{errors.country}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Message</label>
          <textarea
            rows={5}
            value={values.message}
            onChange={(e) => setField("message", e.target.value)}
            className={input}
            placeholder={messagePlaceholder}
          />
        </div>

        {submitError && <p className={errorText}>{submitError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/30 transition hover:scale-[1.01] hover:shadow-accent/50 disabled:opacity-60"
        >
          {submitIcon}
          {submitting ? "Submitting…" : submitLabel}
        </button>
      </form>
    </>
  );
}
