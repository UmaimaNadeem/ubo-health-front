import { api, clearGuestToken, clearTokens, setTokens } from "./client";
import type { AuthSession, User } from "./types";

export type RegisterPayload = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
};

export type WholesaleApplyPayload = {
  email: string;
  password: string;
  requestedRole: "retailer" | "wholesaler";
  fullName?: string;
  businessName?: string;
  phone?: string;
  country?: string;
  businessType?: string;
  websiteOrRegistration?: string;
  supplyFormat?: string;
  estimatedMonthlyPurchasing?: string;
  productsOfInterest?: string;
  targetMarket?: string;
  orderFrequency?: string;
  additionalRequirements?: string;
  businessEnquiryConfirmed?: boolean;
  // Kept for existing business-auth/legacy callers.
  businessRegistrationNo?: string;
  message?: string;
  firstName?: string;
  lastName?: string;
};

async function persistSession(session: AuthSession): Promise<AuthSession> {
  setTokens(session.accessToken, session.refreshToken);
  // The guest cart/wishlist was just merged server-side on login/register — the
  // guest token is no longer meaningful, drop it so future requests use the JWT.
  clearGuestToken();
  return session;
}

export async function register(payload: RegisterPayload) {
  const session = await api.post<AuthSession>("/auth/register", payload);
  return persistSession(session);
}

export async function wholesaleApply(payload: WholesaleApplyPayload) {
  const session = await api.post<AuthSession>("/auth/wholesale-apply", payload);
  return persistSession(session);
}

export async function login(email: string, password: string) {
  const session = await api.post<AuthSession>("/auth/login", { email, password });
  return persistSession(session);
}

export async function logout(refreshToken: string | null) {
  try {
    if (refreshToken) await api.post("/auth/logout", { refreshToken });
  } finally {
    clearTokens();
  }
}

export function me() {
  return api.get<User>("/auth/me");
}
