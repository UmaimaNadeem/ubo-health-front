import { Link } from "react-router-dom";
import { useProducts } from "../lib/api";
import { useWishlist } from "../context/contexts";
import { ProductThumb } from "../components/ProductThumb";

export default function Wishlist() {
  const { items: wishlistItems } = useWishlist();
  const { data: allProducts = [] } = useProducts();
  const wishedIds = new Set(wishlistItems.map((w) => w.productId));
  const items = allProducts.filter((p) => wishedIds.has(p.id));
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-black">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">Your wishlist is empty.</p>
          <Link to="/peptides" className="mt-4 inline-block text-accent hover:underline">
            Browse peptides
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {items.map((p) => (
            <ProductThumb key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
