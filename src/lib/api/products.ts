// lib/api/products.ts
import apiClient from "./client";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

// Get all products
export const getProducts = async (
  page = 1,
  limit = 12,
  filters: Record<string, any> = {}
): Promise<{ products: Product[]; total: number; pages: number }> => {
  try {
    const params = {
      page,
      limit,
      ...filters,
    };

    const response = await apiClient.get("/products/products/", { params });

    // Handle pagination format from Django REST Framework
    if ("results" in response.data) {
      return {
        products: response.data.results,
        total: response.data.count,
        pages: Math.ceil(response.data.count / limit),
      };
    }

    // Handle non-paginated responses
    return {
      products: response.data,
      total: response.data.length,
      pages: 1,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 8): Promise<Product[]> => {
  try {
    // In a real app, you would have an endpoint for featured products
    // For now, we'll simulate this by getting all products and filtering
    const { products } = await getProducts(1, limit);
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
};

// Get new arrivals
export const getNewArrivals = async (limit = 8): Promise<Product[]> => {
  try {
    // In a real app, you would have an endpoint for new arrivals
    // For now, we'll simulate this by getting all products sorted by created_at
    const { products } = await getProducts(1, limit, {
      ordering: "-created_at",
    });
    return products;
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error;
  }
};

// Get a product by slug
export const getProductBySlug = async (
  slug: string
): Promise<Product | null> => {
  try {
    const response = await apiClient.get(`/products/products/${slug}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
};

// Get similar products
export const getSimilarProducts = async (
  productId: number,
  categoryId: number,
  limit = 4
): Promise<Product[]> => {
  try {
    // In a real app, you would have an endpoint for similar products
    // For now, we'll simulate this by getting products from the same category
    const response = await apiClient.get(`/products/products/`, {
      params: {
        category: categoryId,
        exclude: productId,
        limit,
      },
    });

    // Handle pagination format from Django REST Framework
    if ("results" in response.data) {
      return response.data.results;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching similar products:", error);
    throw error;
  }
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get("/products/categories/");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Get products in a category
export const getCategoryProducts = async (
  categorySlug: string,
  page = 1,
  limit = 12,
  filters: Record<string, any> = {}
): Promise<{ products: Product[]; total: number; pages: number }> => {
  try {
    const params = {
      page,
      limit,
      ...filters,
    };

    const response = await apiClient.get(
      `/products/categories/${categorySlug}/`,
      { params }
    );

    // Extract the products from the response
    const products = response.data.products || [];
    const total = response.data.total || products.length;
    const pages = response.data.pages || Math.ceil(total / limit);

    return { products, total, pages };
  } catch (error) {
    console.error(
      `Error fetching products in category ${categorySlug}:`,
      error
    );
    throw error;
  }
};

// Get product reviews
export const getProductReviews = async (productId: number): Promise<any[]> => {
  try {
    const response = await apiClient.get(
      `/products/products/${productId}/reviews/`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    throw error;
  }
};

// Add a product review
export const addProductReview = async (
  productId: number,
  reviewData: { rating: number; comment: string }
): Promise<any> => {
  try {
    const response = await apiClient.post(
      `/products/products/${productId}/review/`,
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding review for product ${productId}:`, error);
    throw error;
  }
};

// Search products
export const searchProducts = async (
  query: string,
  page = 1,
  limit = 12,
  filters: Record<string, any> = {}
): Promise<{ products: Product[]; total: number; pages: number }> => {
  try {
    const params = {
      query,
      page,
      limit,
      ...filters,
    };

    const response = await apiClient.post("/search/search/", params);

    return {
      products: response.data.results,
      total: response.data.total,
      pages: response.data.pages,
    };
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    throw error;
  }
};
