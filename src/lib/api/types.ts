export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  basePrice: number;
  stockQty: number | null;
  comingSoon: boolean;
  outOfStock: boolean;
};

export type ProductForm = "pen" | "vial";

export type LinkedProduct = {
  id: string;
  slug: string;
  name: string;
  type: ProductForm | null;
  price: number;
  image: string | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  type: ProductForm | null;
  isFeatured: boolean;
  linkedProduct: LinkedProduct | null;
  price: number;
  basePrice: number;
  originalPrice: number | null;
  badges: ("new" | "bestseller" | "sale")[];
  description: string;
  image: string | null;
  images: string[];
  variants: ProductVariant[] | null;
  comingSoon: boolean;
  outOfStock: boolean;
  stockQty: number | null;
};

export type ProductProfileRow = { label: string; value: string };
export type ProductBenefit = { title: string; body: string };
export type ProductDosage = {
  overview: string;
  table: { amount: string; dosage: string }[];
  notes: string[];
} | null;
export type ProductSideEffects = { intro: string; effects: string[]; note: string } | null;
export type ProductResearch = { title: string; body: string };
export type ProductFaq = { q: string; a: string };
export type ProductInfoBlock = { title: string; body: string };
export type ProductStep = { title: string; body: string };

export type ProductDetailBlock = {
  profile: ProductProfileRow[];
  summary: string | null;
  features: string[];
  benefits: ProductBenefit[];
  dosage: ProductDosage;
  sideEffects: ProductSideEffects;
  research: ProductResearch[];
  faqs: ProductFaq[];
  conclusion: string | null;
  diagram: string | null;
  steps: ProductStep[];
  note: string | null;
  info: ProductInfoBlock[];
} | null;

export type ProductWithDetail = Product & {
  weightGrams: number;
  detail: ProductDetailBlock;
};

export type Plan = {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  image: string | null;
  comingSoon: boolean;
  cycleLength: string | null;
  planType: "single" | "multi_package";
};

export type PlanIncluded = { role: string; slug: string; name: string };
export type PlanDosing = {
  overview: string | null;
  perPeptide: { name: string; schedule: string }[];
  penCounts: { cycle: string; pens: string }[];
} | null;
export type PlanPackageItem = { dosage: string; cycle: string; slug: string; name: string };
export type PlanPackage = {
  id: string;
  name: string;
  goal: string | null;
  price: number;
  penCounts: string | null;
  included: PlanPackageItem[];
};

export type PlanDetail = Plan & {
  images: string[];
  intro: string | null;
  overview: string | null;
  howItHelps: string[];
  conclusion: string | null;
  included?: PlanIncluded[];
  dosing?: PlanDosing;
  packages?: PlanPackage[];
};

export type ShippingRate = {
  method: "standard" | "express";
  pricingModel: "flat" | "weight_based";
  flatPrice: number | null;
  basePrice: number | null;
  pricePerKg: number | null;
  freeShippingThreshold: number | null;
  etaLabel: string | null;
};

export type ShippingZone = {
  name: string;
  countries: string[];
  rates: ShippingRate[];
};

export type UserRole = "customer" | "retailer" | "wholesaler" | "admin";
export type UserStatus = "pending_approval" | "active" | "suspended";

export type User = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  companyName: string | null;
  country: string | null;
};

export type AuthSession = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type Address = {
  id: string;
  label: string | null;
  firstName: string;
  lastName: string;
  address: string;
  apt: string | null;
  city: string;
  postal: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
};

export type SaveAddressPayload = {
  label?: string;
  firstName: string;
  lastName: string;
  address: string;
  apt?: string;
  city: string;
  postal: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
};

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  variantId: string | null;
  variantLabel: string | null;
  planPackageId: string | null;
  packageName: string | null;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  stockQty: number | null;
};

export type CartSummary = {
  items: CartItem[];
  count: number;
  total: number;
};

export type WishlistItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
};

export type WishlistSummary = {
  items: WishlistItem[];
  count: number;
};

export type OrderItem = {
  name: string;
  variantLabel: string | null;
  packageName: string | null;
  unitPrice: number;
  qty: number;
  lineTotal: number;
};

export type PaymentProofStatus = "pending" | "accepted" | "rejected";

export type PaymentProof = {
  id: string;
  orderId: string;
  txHash: string | null;
  receiptUrl: string | null;
  status: PaymentProofStatus;
  reviewedAt: string | null;
  adminNotes: string | null;
  createdAt: string;
};

export type PaymentMethod = {
  code: string;
  label: string;
  instructions: string | null;
  walletAddress: string | null;
};

export type Order = {
  id: string;
  userId: string | null;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  currency: string;
  subtotal: number;
  shippingMethod: string;
  shippingCost: number;
  discountCode: string | null;
  discountAmount: number;
  total: number;
  contactEmail: string;
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    apt: string | null;
    city: string;
    postal: string;
    country: string;
    phone: string | null;
  };
  payment: {
    method: string;
    label: string;
    instructions: string | null;
    walletAddress: string | null;
  };
  items: OrderItem[];
  paymentProofs: PaymentProof[];
  createdAt: string;
};

export type PaymentSession = {
  provider: "euro_nutra" | string;
  sessionId?: string;
  status: string;
  expiresAt?: string | null;
  paymentUrl: string | null;
};

export type PlacedOrder = Order & {
  paymentSession?: PaymentSession;
};

export type PlaceOrderPayload = {
  contactEmail: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress: string;
  shippingApt?: string;
  shippingCity: string;
  shippingPostal: string;
  shippingCountry: string;
  shippingPhone?: string;
  shippingMethod: "standard" | "express";
  paymentMethodCode: string;
  couponCode?: string;
  notes?: string;
};
