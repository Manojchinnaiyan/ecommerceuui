// components/products/product-category-grid.tsx
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/api/categories";

export async function ProductCategoryGrid() {
  const categories = await getCategories();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square"
        >
          {/* Category Image */}
          <div className="absolute inset-0">
            <Image
              src={category.image || "/images/category-placeholder.jpg"}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-opacity"></div>
          </div>

          {/* Category Name */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white text-2xl font-bold text-center p-4">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
