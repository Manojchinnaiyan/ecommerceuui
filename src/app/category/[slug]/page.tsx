// src/app/category/[slug]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilter } from "@/components/products/product-filter";
import { getCategoryProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  };
}

export async function generateStaticParams() {
  // Pre-render the most popular categories at build time
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = params;
  const page = parseInt(searchParams.page || "1");
  const pageSize = 12;

  // Process filter parameters
  const filters: Record<string, any> = {};

  if (searchParams.sort) {
    filters.ordering = searchParams.sort;
  }

  if (searchParams.minPrice) {
    filters.min_price = parseFloat(searchParams.minPrice);
  }

  if (searchParams.maxPrice) {
    filters.max_price = parseFloat(searchParams.maxPrice);
  }

  if (searchParams.inStock === "true") {
    filters.in_stock = true;
  }

  try {
    // Fetch category products with filters and pagination
    const { products, total, pages } = await getCategoryProducts(
      slug,
      page,
      pageSize,
      filters
    );

    // Use the category info from the response or fetch it separately
    const categories = await getCategories();
    const category = categories.find((cat) => cat.slug === slug);

    if (!category) {
      return notFound();
    }

    return (
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Category Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-600 max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters (sidebar) */}
            <div className="w-full md:w-64 flex-shrink-0">
              <ProductFilter
                currentFilters={searchParams}
                categorySlug={slug}
                productCount={total}
              />
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Results Count and Sort Options */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <p className="text-gray-600 mb-4 sm:mb-0">
                  Showing {products.length} of {total} products
                </p>

                <div className="flex items-center">
                  <label htmlFor="sort" className="text-sm mr-2">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    defaultValue={searchParams.sort || "default"}
                  >
                    <option value="default">Featured</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                    <option value="-name">Name: Z to A</option>
                    <option value="-created_at">Newest</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <Suspense fallback={<div>Loading products...</div>}>
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </Suspense>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or check back later for new
                    arrivals.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {pages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <a
                      href={`/category/${slug}?page=${Math.max(page - 1, 1)}`}
                      className={`px-3 py-1 rounded border ${
                        page <= 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </a>

                    {Array.from({ length: pages }, (_, i) => (
                      <a
                        key={i + 1}
                        href={`/category/${slug}?page=${i + 1}`}
                        className={`px-3 py-1 rounded ${
                          page === i + 1
                            ? "bg-black text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </a>
                    ))}

                    <a
                      href={`/category/${slug}?page=${Math.min(
                        page + 1,
                        pages
                      )}`}
                      className={`px-3 py-1 rounded border ${
                        page >= pages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </a>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error(`Error loading category ${slug}:`, error);
    return notFound();
  }
}
