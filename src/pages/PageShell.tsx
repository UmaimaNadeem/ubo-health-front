import { type ReactNode } from "react";

/**
 * Shared shell for simple text pages (title + subtitle + prose body).
 * Used by the FAQ, Check Code, and the short legal/info pages.
 */
export function Page({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <section className="border-b bg-secondary">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-3xl font-black md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
      </section>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 text-sm leading-relaxed text-foreground/90 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_p]:text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
