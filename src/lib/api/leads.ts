import { api } from "./client";

export type LeadPayload = {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone: string;
  country: string;
  message?: string;
};

export type WholesaleLeadPayload = {
  fullName: string;
  businessName: string;
  email: string;
  phone?: string;
  country: string;
  businessType: string;
  websiteOrRegistration?: string;
  supplyFormat: string;
  estimatedMonthlyPurchasing: string;
  productsOfInterest: string;
  targetMarket: string;
  orderFrequency?: string;
  additionalRequirements?: string;
};

export function submitLead(payload: LeadPayload) {
  return api.post<{ id: string }>("/leads", { ...payload, kind: "contact" });
}

/**
 * B2B enquiry endpoint payload. This deliberately uses the existing leads route
 * instead of creating/logging in a wholesale user. The API must accept
 * kind: "wholesale" and the additional B2B fields below.
 */
export function submitWholesaleLead(payload: WholesaleLeadPayload) {
  return api.post<{ id: string }>("/leads", { ...payload, kind: "wholesale" });
}
