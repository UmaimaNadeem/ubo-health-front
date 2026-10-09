import { useEffect, useLayoutEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppProviders } from "./context/contexts";
import { Layout } from "./components/layout/Layout";
import { OnyxLoader } from "./components/OnyxLoader";
import Home from "./pages/Home";
import Peptides from "./pages/Peptides";
import ProductRoute from "./pages/ProductRoute";
import PlanDetail from "./pages/PlanDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import QuickOrder from "./pages/QuickOrder";
import { Login, Register } from "./pages/Auth";
import { BusinessLogin, BusinessRegister } from "./pages/BusinessAuth";
import { WholesaleApplication } from "./pages/Wholesale";
import { WhatArePeptides } from "./pages/WhatArePeptides";
import { FAQ } from "./pages/Faq";
import { CheckCode } from "./pages/CheckCode";
import { ReferenceCalculatorPage } from "./pages/ReferenceCalculatorPage";
import { PaymentDelivery } from "./pages/PaymentDelivery";
import { PeptidePlans } from "./pages/PeptidePlans";
import { Contact } from "./pages/Contact";
import { Returns, NotFound } from "./pages/InfoPages";
import {
  PrivacyPolicy,
  TermsConditions,
  RefundPolicy,
  ShippingPolicy,
  CookiesPolicy,
  AccessibilityPolicy,
} from "./pages/Policies";
import Consultation from "./pages/Consultation";

function ScrollToTop() {
  const { pathname } = useLocation();
  // Jump straight to the top of each new page (no smooth animation).
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <>
      <OnyxLoader />
      <AppProviders>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/peptides" element={<Peptides />} />
            <Route path="/peptides/:slug" element={<Peptides />} />
            <Route path="/product/:slug" element={<ProductRoute />} />
            <Route
              path="/dual-chamber-auto-mixing-pen"
              element={<Navigate to="/product/dual-chamber-auto-mixing-pen" replace />}
            />
            <Route path="/what-are-peptides" element={<WhatArePeptides />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/check-code" element={<CheckCode />} />
            <Route
              path="/analytical-reference-calculator"
              element={<ReferenceCalculatorPage />}
            />
            <Route path="/payment-delivery" element={<PaymentDelivery />} />
            <Route path="/peptide-plans" element={<PeptidePlans />} />
            <Route path="/peptide-plans/:slug" element={<PlanDetail />} />
            <Route path="/wholesale-application" element={<WholesaleApplication />} />
            <Route path="/product-returns" element={<Returns />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/b2b-login" element={<BusinessLogin />} />
            <Route path="/b2b-register" element={<BusinessRegister />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quick-order" element={<QuickOrder />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/cookies-policy" element={<CookiesPolicy />} />
            <Route path="/accessibility-policy" element={<AccessibilityPolicy />} />
            <Route path="/independent-doctor-consultation" element={<Consultation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      </AppProviders>
    </>
  );
}
