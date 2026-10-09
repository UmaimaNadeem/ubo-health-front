import { useState } from "react";

// Shared front-end validation helpers used by the contact, wholesale and
// checkout forms. Kept dependency-free and framework-light to match the
// existing hand-rolled forms.

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// Accepts an optional leading + and at least 7 digits, allowing spaces,
// dashes, parentheses and dots as separators.
export const isPhone = (v: string) => {
  const digits = v.replace(/[\s()+.-]/g, "");
  return /^\d{7,15}$/.test(digits);
};

export type Errors<T> = Partial<Record<keyof T, string>>;

/**
 * Lightweight controlled-form helper: tracks values + validation errors.
 * Validates on submit, then re-validates each field on change once the form
 * has been submitted so errors clear as the user corrects them.
 */
export function useFormValidation<T extends Record<string, string>>(
  initial: T,
  validate: (values: T) => Errors<T>,
) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [submitted, setSubmitted] = useState(false);

  const setField = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (submitted) setErrors(validate(next));
      return next;
    });
  };

  const handleSubmit = (onValid: (values: T) => void) => (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setSubmitted(true);
    if (Object.keys(found).length === 0) onValid(values);
  };

  return { values, errors, setField, handleSubmit };
}
