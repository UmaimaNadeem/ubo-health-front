import { Page } from "./PageShell";

// Short, text-only informational pages that all share the same <Page> shell.

export function Returns() {
  return (
    <Page title="Product Returns">
      <p>
        Due to the temperature-sensitive nature of peptides, opened or unsealed products cannot be
        returned. Damaged or incorrect orders are replaced free of charge.
      </p>
      <h2>Reporting an issue</h2>
      <p>
        Contact us within 7 days of delivery with photos and your order number. We will arrange
        replacement or refund.
      </p>
    </Page>
  );
}

export function NotFound() {
  return (
    <Page title="404 - Page not found" subtitle="The page you were looking for does not exist.">
      <p>
        Try the{" "}
        <a href="/" className="text-accent hover:underline">
          home page
        </a>{" "}
        or browse the{" "}
        <a href="/peptides" className="text-accent hover:underline">
          peptide catalog
        </a>
        .
      </p>
    </Page>
  );
}
