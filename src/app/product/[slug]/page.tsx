// src/app/product/[slug]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/products/product-details";
import { ProductReviews } from "@/components/products/product-reviews";
import { ProductDetailSkeleton } from "@/components/products/product-detail-skeleton";
import { getProductBySlug, getSimilarProducts } from "@/lib/api/products";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  try {
    // Fetch product details
    const product = await getProductBySlug(slug);

    if (!product) {
      return notFound();
    }

    // Fetch similar products
    const similarProducts = await getSimilarProducts(
      product.id,
      product.category.id
    );

    return (
      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Product Details */}
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetails product={product} />
          </Suspense>

          {/* Product Reviews */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <Suspense fallback={<div>Loading reviews...</div>}>
              <ProductReviews productId={product.id} />
            </Suspense>
          </section>

          {/* Similar Products */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <div key={product.id}>
                  {/* Reuse ProductCard but use React.lazy or dynamic import for optimization */}
                  {/* For now, a placeholder will do */}
                  <div className="bg-gray-100 aspect-square rounded-lg"></div>
                  <div className="mt-2">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-gray-700">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    console.error(`Error loading product ${slug}:`, error);
    return notFound();
  }
}
