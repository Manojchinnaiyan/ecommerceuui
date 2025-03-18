// components/products/similar-products.tsx
import { ProductCard } from "@/components/products/product-card";
import { getSimilarProducts } from "@/lib/api/products";

interface SimilarProductsProps {
  productId: number;
  categoryId: number;
}

export async function SimilarProducts({
  productId,
  categoryId,
}: SimilarProductsProps) {
  const products = await getSimilarProducts(productId, categoryId);

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No similar products found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
