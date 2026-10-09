// Single source of truth for public contact details. Update here and every
// touchpoint (footer, contact page, wholesale page, floating button) follows.

// wa.me needs the bare international form; the footer also prints the number as
// readable text, so both spellings live here and must be kept in step.
const WHATSAPP_NUMBER = "447404932343";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/** Human-readable form of WHATSAPP_NUMBER, for rendering as visible text. */
export const WHATSAPP_DISPLAY = "+44 7404 932343";

export const SALES_EMAIL = "sales@onyxhealth.net";

/** Regions we field business enquiries from, in display order. */
export const ENQUIRY_REGIONS = ["Middle East", "United Kingdom", "Europe"];
