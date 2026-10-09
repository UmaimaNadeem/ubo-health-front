// TEMPORARY until the backend supports COA uploads. Files live in public/certificates/.
// Keyed by product id, then variant id, so a certificate only shows for its exact dosage.
// A plain string is only for products with no variants (e.g. HCG).
const PRODUCT_COAS: Record<string, string | Record<string, string>> = {
  "1": { "89": "Onyx_5 Amino 1MQ 100mg_v02.pdf" },
  "3": {
    "17": "Onyx_Reta_10mg_v02.pdf",
    "2": "Onyx_Reta_20mg_v02.pdf",
    "1": "Onyx_Reta_40mg_v02.pdf",
  },
  "5": { "58": "Onyx_CJC-1295 (no DAC) 10mg_v02.pdf" },
  "19": { "31": "Onyx_BPC 157 (10mg)_v02.pdf" },
  "21": { "36": "Onyx_TB 500 (10mg)_v02.pdf" },
  "22": "Onyx_HCG _v02.pdf",
  "26": { "18": "Onyx_MOTS C 10mg_v02.pdf" },
  "27": {
    "4": "Onyx_NAD+ 500mg_v02.pdf",
    "5": "Onyx_NAD+ 1000mg_v02.pdf",
  },
  "29": { "47": "Onyx_GHK (Cu) 100mg_v02.pdf" },
  "47": { "42": "Onyx_Glow Blend_v02.pdf" },
  "49": { "116": "Onyx_Longevity Pen_v02.pdf" },
  "54": { "90": "Onyx_Vitality Blend_v02.pdf" },
  "59": { "15": "Onyx_Tirzepatide 20mg_v02.pdf" },
  "60": { "115": "Onyx_FOXO4-DRI 5mg_v02.pdf" },
  "96": { "55": "Onyx_CJC-1295 (no DAC) + GHRP-2 5mg+5mg_v04.pdf" },
};

export function certificateUrl(productId: string, variantId: string | undefined): string | null {
  const entry = PRODUCT_COAS[productId];
  const file = typeof entry === "string" ? entry : variantId ? entry?.[variantId] : undefined;
  return file ? `/certificates/${encodeURIComponent(file)}` : null;
}
