import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, cartApi, wishlistApi } from "../lib/api";
import { clearTokens, getAccessToken, getRefreshToken } from "../lib/api/client";
import type {
  CartItem,
  RegisterPayload,
  User,
  WholesaleApplyPayload,
  WishlistItem,
} from "../lib/api";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 30_000 } },
});

// --- Auth -----------------------------------------------------------------

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  wholesaleApply: (payload: WholesaleApplyPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const qc = useQueryClient();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (getAccessToken()) {
        try {
          const me = await authApi.me();
          if (!cancelled) setUser(me);
        } catch {
          clearTokens();
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Login/register/wholesale-apply merge the guest cart & wishlist server-side —
  // refetch both so the UI picks up the merged state under the new identity.
  const afterAuthChange = () => {
    qc.invalidateQueries({ queryKey: ["cart"] });
    qc.invalidateQueries({ queryKey: ["wishlist"] });
  };

  const login = async (email: string, password: string) => {
    const session = await authApi.login(email, password);
    setUser(session.user);
    afterAuthChange();
  };

  const register = async (payload: RegisterPayload) => {
    const session = await authApi.register(payload);
    setUser(session.user);
    afterAuthChange();
  };

  const wholesaleApply = async (payload: WholesaleApplyPayload) => {
    const session = await authApi.wholesaleApply(payload);
    setUser(session.user);
    afterAuthChange();
  };

  const logout = async () => {
    await authApi.logout(getRefreshToken());
    setUser(null);
    afterAuthChange();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, wholesaleApply, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth outside provider");
  return c;
};

// --- Cart -------------------------------------------------------------------

type AddCartItemInput = {
  productId: string;
  variantId?: string;
  planPackageId?: string;
  qty?: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  total: number;
  isLoading: boolean;
  addItem: (input: AddCartItemInput) => Promise<void>;
  setQty: (itemId: string, qty: number) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
};

const CartContext = createContext<CartCtx | null>(null);

function CartProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["cart"], queryFn: cartApi.getCart });

  const addItem = async (input: AddCartItemInput) => {
    const updated = await cartApi.addCartItem(input);
    qc.setQueryData(["cart"], updated);
  };
  const setQty = async (itemId: string, qty: number) => {
    const updated = await cartApi.updateCartItem(itemId, qty);
    qc.setQueryData(["cart"], updated);
  };
  const remove = async (itemId: string) => {
    const updated = await cartApi.removeCartItem(itemId);
    qc.setQueryData(["cart"], updated);
  };
  const clear = async () => {
    const updated = await cartApi.clearCart();
    qc.setQueryData(["cart"], updated);
  };

  return (
    <CartContext.Provider
      value={{
        items: data?.items ?? [],
        count: data?.count ?? 0,
        total: data?.total ?? 0,
        isLoading,
        addItem,
        setQty,
        remove,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart outside provider");
  return c;
};

// --- Wishlist -----------------------------------------------------------------

type WishlistCtx = {
  items: WishlistItem[];
  count: number;
  isLoading: boolean;
  toggle: (productId: string) => Promise<void>;
  has: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistCtx | null>(null);

function WishlistProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["wishlist"], queryFn: wishlistApi.getWishlist });
  const items = data?.items ?? [];
  const has = (productId: string) => items.some((i) => i.productId === productId);

  const toggle = async (productId: string) => {
    const updated = has(productId)
      ? await wishlistApi.removeWishlistItem(productId)
      : await wishlistApi.addWishlistItem(productId);
    qc.setQueryData(["wishlist"], updated);
  };

  return (
    <WishlistContext.Provider value={{ items, count: items.length, isLoading, toggle, has }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const c = useContext(WishlistContext);
  if (!c) throw new Error("useWishlist outside provider");
  return c;
};

// --- Combined provider -----------------------------------------------------

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>{children}</CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
