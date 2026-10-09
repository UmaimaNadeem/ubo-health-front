import { useEffect, useState } from "react";
import onyxCircle from "../assets/onyx-circle.png";
import onyxWordmark from "../assets/onyx-wordmark.png";

const MINIMUM_DISPLAY_MS = 3000;

export function OnyxLoader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const started = performance.now();

    const hideLoader = () => {
      const remaining = Math.max(0, MINIMUM_DISPLAY_MS - (performance.now() - started));
      window.setTimeout(() => {
        setHidden(true);
        window.setTimeout(() => setRemoved(true), 600);
      }, remaining);
    };

    if (document.readyState === "complete") hideLoader();
    else window.addEventListener("load", hideLoader, { once: true });

    return () => window.removeEventListener("load", hideLoader);
  }, []);

  if (removed) return null;

  return (
    <div
      id="onyx-loader"
      className={hidden ? "is-hidden" : ""}
      role="status"
      aria-label="Loading ONYX Research"
    >
      <div className="onyx-loader__content">
        <div className="onyx-loader__logo-wrap">
          <img className="onyx-loader__mark" src={onyxCircle} alt="" />
          <img className="onyx-loader__wordmark" src={onyxWordmark} alt="ONYX Research" />
        </div>
      </div>
    </div>
  );
}
