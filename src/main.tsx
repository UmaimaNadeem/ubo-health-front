import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "flag-icons/css/flag-icons.min.css";

import { CurrencyProvider } from "./context/CurrencyContext";
import { applyTranslateDomGuards } from "./lib/googleTranslate";

applyTranslateDomGuards();

createRoot(
  document.getElementById("root")!,
).render(
  <StrictMode>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </StrictMode>,
);