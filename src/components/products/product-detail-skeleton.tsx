// components/products/product-detail-skeleton.tsx
export const ProductDetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images Skeleton */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>

        {/* Thumbnail Images */}
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-20 h-20 bg-gray-200 rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Product Info Skeleton */}
      <div>
        {/* Breadcrumb */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>

        {/* Product Name */}
        <div className="h-8 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>

        {/* Rating */}
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>

        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>

        {/* Description */}
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>

        {/* Size Selection */}
        <div className="mb-6">
          <div className="h-4 bg-gray-200 rounded w-1/5 mb-2 animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 w-16 bg-gray-200 rounded-md animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-6">
          <div className="h-4 bg-gray-200 rounded w-1/5 mb-2 animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <div className="h-4 bg-gray-200 rounded w-1/5 mb-2 animate-pulse"></div>
          <div className="flex items-center">
            <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded ml-4 animate-pulse"></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="h-12 bg-gray-200 rounded-md w-full animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-md w-12 animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-md w-12 animate-pulse"></div>
        </div>

        {/* Product Details */}
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
