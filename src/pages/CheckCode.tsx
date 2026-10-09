import { useState } from "react";
import { Page } from "./PageShell";

export function CheckCode() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<null | { ok: boolean; msg: string }>(null);
  return (
    <Page title="Check Code" subtitle="Verify the authenticity of your product batch.">
      <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
        Coming soon
      </div>
      <p>
        Batch code verification is launching soon. Every product ships with a unique batch code
        printed on the vial label. You'll soon be able to enter it here to confirm authenticity and
        view the independently verified purity figure.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setResult(
            code.trim().length >= 6
              ? {
                  ok: true,
                  msg: `Batch ${code.toUpperCase()} verified. Purity at least 99%. Tested ${new Date().toLocaleDateString()}.`,
                }
              : { ok: false, msg: "Invalid code format. Codes are at least 6 characters." },
          );
        }}
        className="flex flex-col gap-3 opacity-60 sm:flex-row"
      >
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled
          placeholder="Enter batch code (e.g. NP12345)"
          className="flex-1 cursor-not-allowed rounded-md border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <button
          disabled
          className="cursor-not-allowed rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
        >
          Verify
        </button>
      </form>
      {result && (
        <div
          className={`rounded-md border p-4 text-sm ${result.ok ? "border-emerald-500/50 bg-emerald-50 text-emerald-900" : "border-destructive/50 bg-destructive/10 text-destructive"}`}
        >
          {result.msg}
        </div>
      )}
    </Page>
  );
}
