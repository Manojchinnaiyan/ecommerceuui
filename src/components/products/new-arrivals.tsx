// components/products/new-arrivals.tsx
import { ProductCard } from "@/components/products/product-card";
import { getNewArrivals } from "@/lib/api/products";

export async function NewArrivals() {
  const products = await getNewArrivals();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
