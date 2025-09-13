import { useQuery } from "@tanstack/react-query";
import { ProductProps } from "@/app/products/models/Products";
import { getProducts, getSingleProduct } from "@/lib/api/products";

// VM for product list
export const useProductListVm = () => {
  const query = useQuery<ProductProps[], Error>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return {
    products: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

// VM for single product
export const useSingleProductVm = (id: string) => {
  const query = useQuery<ProductProps, Error>({
    queryKey: ["product", id],
    queryFn: async () => {
      const products = await getSingleProduct(id);
      // If getSingleProduct returns an array, pick the first item
      return Array.isArray(products) ? products[0] : products;
    },
    enabled: !!id, // only fetch if id is defined
  });

  return {
    product: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
