import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
};

function setMetaContent(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  const previous = el.getAttribute("content") ?? "";
  el.setAttribute("content", content);
  return previous;
}

export function Seo({ title, description, jsonLd, noindex }: SeoProps) {
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : undefined;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const previousDescription = setMetaContent("name", "description", description);
    const previousOgTitle = setMetaContent("property", "og:title", title);
    const previousOgDescription = setMetaContent("property", "og:description", description);
    const previousRobots = noindex
      ? setMetaContent("name", "robots", "noindex, nofollow")
      : undefined;

    let script: HTMLScriptElement | null = null;
    if (jsonLdString) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = jsonLdString;
      document.head.appendChild(script);
    }

    return () => {
      document.title = previousTitle;
      setMetaContent("name", "description", previousDescription);
      setMetaContent("property", "og:title", previousOgTitle);
      setMetaContent("property", "og:description", previousOgDescription);
      if (noindex) setMetaContent("name", "robots", previousRobots || "index, follow");
      script?.remove();
    };
  }, [title, description, jsonLdString, noindex]);

  return null;
}
