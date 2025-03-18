// src/components/products/product-filter.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

interface ProductFilterProps {
  currentFilters: {
    page?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  };
  categorySlug: string;
  productCount: number;
}

export function ProductFilter({
  currentFilters,
  categorySlug,
  productCount,
}: ProductFilterProps) {
  const router = useRouter();

  // State for filter visibility on mobile
  const [filtersVisible, setFiltersVisible] = useState(false);

  // State for filter sections on mobile
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    availability: true,
  });

  // Filter form state
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || "");
  const [inStock, setInStock] = useState(currentFilters.inStock === "true");

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section as keyof typeof expandedSections],
    });
  };

  // Apply filters
  const applyFilters = () => {
    // Construct query params
    const params = new URLSearchParams();

    // Preserve any existing sort parameter
    if (currentFilters.sort) {
      params.append("sort", currentFilters.sort);
    }

    // Add price filters if provided
    if (minPrice) {
      params.append("minPrice", minPrice);
    }

    if (maxPrice) {
      params.append("maxPrice", maxPrice);
    }

    // Add availability filter
    if (inStock) {
      params.append("inStock", "true");
    }

    // Reset to page 1 when applying new filters
    params.append("page", "1");

    // Navigate to the filtered URL
    router.push(`/category/${categorySlug}?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);

    // Preserve sort parameter if it exists
    const params = new URLSearchParams();
    if (currentFilters.sort) {
      params.append("sort", currentFilters.sort);
    }

    router.push(`/category/${categorySlug}?${params.toString()}`);
  };

  return (
    <div className="mb-6 md:mb-0">
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setFiltersVisible(!filtersVisible)}
          className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          <span className="flex items-center">
            <Filter size={18} className="mr-2" />
            Filters
          </span>
          {filtersVisible ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Filter Container */}
      <div className={`${filtersVisible ? "block" : "hidden"} md:block`}>
        <div className="bg-white p-4 border border-gray-200 rounded-lg sticky top-20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-black"
            >
              Clear all
            </button>
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center mb-3 cursor-pointer md:cursor-default"
              onClick={() => toggleSection("price")}
            >
              <h4 className="font-medium">Price Range</h4>
              <button className="md:hidden">
                {expandedSections.price ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>

            {expandedSections.price && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Min
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="$"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Max
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="$"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Availability Filter */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center mb-3 cursor-pointer md:cursor-default"
              onClick={() => toggleSection("availability")}
            >
              <h4 className="font-medium">Availability</h4>
              <button className="md:hidden">
                {expandedSections.availability ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>

            {expandedSections.availability && (
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-2 text-gray-700">In Stock</span>
                </label>
              </div>
            )}
          </div>

          {/* Summary and Apply Button */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              {productCount} products found
            </p>
            <button
              onClick={applyFilters}
              className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
